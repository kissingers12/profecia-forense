import { NextRequest } from "next/server";
import { Client } from "pg";
import { checkAdmin } from "@/lib/admin-auth";

function checkAuth(req: NextRequest): boolean {
  return checkAdmin(req);
}

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS download_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    file_url text NOT NULL,
    file_name text NOT NULL,
    used boolean DEFAULT false,
    used_at timestamptz,
    created_at timestamptz DEFAULT now()
  );
`;

// La tabla users tiene un CHECK que solo aceptaba meditaciones/escuela;
// sin esto, el registro del plan "clases" ($555) falla
const FIX_PLAN_CONSTRAINT_SQL = `
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_plan_check;
  ALTER TABLE users ADD CONSTRAINT users_plan_check
    CHECK (plan IN ('meditaciones', 'escuela', 'clases'));
`;

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  // Try every common Vercel/Supabase connection string env var
  const connectionString =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    return Response.json({
      error: "No se encontró variable de conexión a la base de datos (POSTGRES_URL_NON_POOLING, DATABASE_URL, etc.).",
    }, { status: 500 });
  }

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(CREATE_TABLE_SQL);
    await client.query(FIX_PLAN_CONSTRAINT_SQL);
    await client.end();
    return Response.json({ ok: true, message: "Base de datos actualizada: plan $555 habilitado." });
  } catch (err: unknown) {
    await client.end().catch(() => {});
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
