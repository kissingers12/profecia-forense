"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, KeyRound, CheckCircle, BookOpen } from "lucide-react";

export default function LibroPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<{ url: string; name: string }[] | null>(null);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/download/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok) {
        setFiles(data.files);
      } else {
        setError(data.error || "Código inválido.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <a href="/" className="mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#c9a84c]/40">
              <Image src="/logo.jpg" alt="100x100Cristianos" width={48} height={48} className="object-cover" />
            </div>
          </a>
          <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mb-4">
            <BookOpen size={28} className="text-[#c9a84c]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 text-center">Descargar tu libro</h1>
          <p className="text-[#8a7a6a] text-sm text-center max-w-xs">
            Ingresa el código que te enviamos para acceder a tu descarga.
          </p>
        </div>

        <div className="card-dark rounded-2xl p-8">
          {files ? (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-[#c9a84c]" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg mb-1">¡Código válido!</h2>
                <p className="text-[#8a7a6a] text-sm">
                  {files.length > 1 ? "Tienes acceso a ambos formatos:" : files[0].name}
                </p>
              </div>
              <div className="space-y-3">
                {files.map((file, i) => (
                  <a
                    key={i}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-base"
                  >
                    <Download size={20} />
                    {files.length > 1
                      ? (file.name.includes("eBook") ? "Descargar eBook" : "Descargar PDF")
                      : "Descargar ahora"}
                  </a>
                ))}
              </div>
              <p className="text-[#4a3a2a] text-xs">
                Este código ya no podrá usarse de nuevo. Guarda los archivos después de descargarlos.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRedeem} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                  Tu código de descarga
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="Ej: HOTMART-A1B2C3"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60 uppercase tracking-widest"
                />
              </div>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || !code}
                className="btn-gold w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading
                  ? <span className="w-5 h-5 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" />
                  : <><KeyRound size={18} /> Acceder a mi descarga</>}
              </button>
              <p className="text-center text-xs text-[#6a5a4a]">
                ¿No tienes código? Escríbenos a{" "}
                <a href="mailto:100x100cristianos@gmail.com" className="text-[#c9a84c] hover:underline">
                  100x100cristianos@gmail.com
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
