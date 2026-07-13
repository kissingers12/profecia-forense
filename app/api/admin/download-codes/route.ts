import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

function checkAuth(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return req.headers.get("x-admin-password") === adminPassword;
}

function getBooks() {
  return {
    ebook: {
      name: "Manual: Escuchar a Dios (eBook)",
      url: process.env.BOOK_EBOOK_URL ?? "https://drive.google.com/uc?export=download&id=1DbteSDSIqnMWZn0Amn16YOXWx9w44owG",
    },
    pdf: {
      name: "Manual: Escuchar a Dios (PDF)",
      url: process.env.BOOK_PDF_URL ?? "https://drive.google.com/uc?export=download&id=19w1bxaT0p7cHjNf4c6oWelAetdZdic68",
    },
  };
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { data } = await supabaseAdmin
    .from("download_codes")
    .select("id, code, file_name, used, used_at, created_at")
    .order("created_at", { ascending: false });

  return Response.json({ codes: data ?? [] });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { bookId, customCode } = await req.json();
  const BOOKS = getBooks();

  const code = customCode?.trim().toUpperCase() ||
    `HOTMART-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  let fileUrl: string;
  let fileName: string;

  if (bookId === "both") {
    fileUrl = JSON.stringify([BOOKS.ebook.url, BOOKS.pdf.url]);
    fileName = JSON.stringify([BOOKS.ebook.name, BOOKS.pdf.name]);
  } else if (bookId === "ebook" || bookId === "pdf") {
    const b = BOOKS[bookId as "ebook" | "pdf"];
    fileUrl = b.url;
    fileName = b.name;
  } else {
    return Response.json({ error: "Libro no válido." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("download_codes")
    .insert({ code, file_url: fileUrl, file_name: fileName })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return Response.json({ error: "Ese código ya existe." }, { status: 409 });
    return Response.json({ error: "Error al crear el código." }, { status: 500 });
  }

  const displayName = bookId === "both" ? "eBook + PDF" : fileName;
  return Response.json({ code: data.code, fileName: displayName });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });
  const { id } = await req.json();
  await supabaseAdmin.from("download_codes").delete().eq("id", id);
  return Response.json({ ok: true });
}
