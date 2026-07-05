"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, type UserSession } from "@/lib/auth";
import { MessageCircle, Send, ArrowLeft, CheckCircle } from "lucide-react";

type Post = {
  id: number;
  user_email: string;
  user_name: string;
  question: string;
  answer: string | null;
  created_at: string;
  answered_at: string | null;
};

export default function ForoPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s || !s.activated) {
      router.push("/login");
      return;
    }
    setSession(s);
    fetchPosts(s.email);
  }, [router]);

  const fetchPosts = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/posts?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts ?? []);
      }
    } catch {}
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !session) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.email, question: question.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al publicar.");
      } else {
        setQuestion("");
        setSent(true);
        setTimeout(() => setSent(false), 4000);
        fetchPosts(session.email);
      }
    } catch {
      setError("Error de conexión.");
    }
    setSending(false);
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#050510]">
      <header className="sticky top-0 z-40 bg-[#050510]/95 backdrop-blur-md border-b border-[#c9a84c]/20">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 text-[#6a5a4a] hover:text-[#c9a84c] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <MessageCircle size={18} className="text-[#c9a84c]" />
          <span className="text-white font-bold">Comunidad · Preguntas</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Form */}
        <div className="card-dark rounded-2xl p-6">
          <h2 className="text-white font-bold mb-1">Hacer una pregunta</h2>
          <p className="text-[#6a5a4a] text-xs mb-4">
            Tu pregunta será visible para toda la comunidad de la Escuela. Kissingers responderá directamente aquí.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Escribe tu pregunta aquí..."
              rows={3}
              maxLength={500}
              className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60 resize-none"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            {sent && (
              <p className="text-green-400 text-xs flex items-center gap-1.5">
                <CheckCircle size={12} /> ¡Pregunta publicada! Kissingers te responderá pronto.
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[#6a5a4a] text-xs">{question.length}/500</span>
              <button
                type="submit"
                disabled={sending || !question.trim()}
                className="btn-gold px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {sending
                  ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" />
                  : <><Send size={13} /> Publicar</>
                }
              </button>
            </div>
          </form>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="w-8 h-8 border-2 border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="card-dark rounded-2xl p-10 text-center text-[#6a5a4a] text-sm">
            Sé el primero en hacer una pregunta a la comunidad.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const isOwn = post.user_email === session.email;
              return (
                <div
                  key={post.id}
                  className={`card-dark rounded-2xl p-5 ${isOwn ? "border border-[#c9a84c]/25" : ""}`}
                >
                  {/* Author */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center text-xs font-bold text-[#c9a84c] shrink-0">
                      {post.user_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-semibold">{post.user_name}</span>
                    {isOwn && (
                      <span className="text-xs bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 rounded-full px-2 py-0.5">
                        Tú
                      </span>
                    )}
                    <span className="text-[#6a5a4a] text-xs ml-auto shrink-0">
                      {new Date(post.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                    </span>
                  </div>

                  {/* Question */}
                  <p className="text-[#d0c0b0] text-sm leading-relaxed">{post.question}</p>

                  {/* Answer */}
                  {post.answer && (
                    <div className="mt-4 pt-4 border-t border-[#c9a84c]/10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/50 flex items-center justify-center text-xs font-bold text-[#c9a84c] shrink-0">
                          K
                        </div>
                        <span className="text-[#c9a84c] text-xs font-bold">Kissingers · Respuesta</span>
                        {post.answered_at && (
                          <span className="text-[#6a5a4a] text-xs ml-auto shrink-0">
                            {new Date(post.answered_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                          </span>
                        )}
                      </div>
                      <p className="text-white text-sm leading-relaxed">{post.answer}</p>
                    </div>
                  )}

                  {/* No answer yet indicator */}
                  {!post.answer && (
                    <p className="text-[#4a3a2a] text-xs mt-3 italic">Esperando respuesta...</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
