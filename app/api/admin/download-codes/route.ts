import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

function checkAuth(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return req.headers.get("x-admin-password") === adminPassword;
}

const BOOKS: Record<string, { name: string; url: string }> = {
  "ebook": {
    name: "Manual: Escuchar a Dios (eBook)",
    url: "https://drive.google.com/uc?export=download&id=1DbteSDSIqnMWZn0Amn16YOXWx9w44owG",
  },
  "pdf": {
    name: "Manual: Escuchar a Dios (PDF)",
    url: "https://drive.google.com/uc?export=download&id=19w1bxaT0p7cHjNf4c6oWelAetdZdic68",
  },
};

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { data } = await supabaseAdmin
    .from("download_codes")
    .select("id, code, file_name, file_name_2, used, used_at, created_at")
    .order("created_at", { ascending: false });

  return Response.json({ codes: data ?? [] });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { bookId, customCode } = await req.json();

  const code = customCode?.trim().toUpperCase() ||
    `HOTMART-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  let insertData: Record<string, string>;
  let displayName: string;

  if (bookId === "both") {
    insertData = {
      code,
      file_url: BOOKS["ebook"].url,
      file_name: BOOKS["ebook"].name,
      file_url_2: BOOKS["pdf"].url,
      file_name_2: BOOKS["pdf"].name,
    };
    displayName = "eBook + PDF";
  } else {
    const book = BOOKS[bookId];
    if (!book) return Response.json({ error: "Libro no válido." }, { status: 400 });
    insertData = { code, file_url: book.url, file_name: book.name };
    displayName = book.name;
  }

  const { data, error } = await supabaseAdmin
    .from("download_codes")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return Response.json({ error: "Ese código ya existe." }, { status: 409 });
    return Response.json({ error: "Error al crear el código." }, { status: 500 });
  }

  return Response.json({ code: data.code, fileName: displayName });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });
  const { id } = await req.json();
  await supabaseAdmin.from("download_codes").delete().eq("id", id);
  return Response.json({ ok: true });
}
