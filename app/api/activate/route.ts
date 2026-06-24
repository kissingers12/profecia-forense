import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { code, plan } = await req.json();

  if (!code || !plan) {
    return Response.json({ valid: false, message: "Datos incompletos." }, { status: 400 });
  }

  const medCodes = (process.env.ACTIVATION_CODES_MED || "").split(",").map((c) => c.trim().toUpperCase());
  const escCodes = (process.env.ACTIVATION_CODES_ESC || "").split(",").map((c) => c.trim().toUpperCase());

  const validCodes = plan === "meditaciones" ? medCodes : escCodes;
  const inputCode = code.trim().toUpperCase();

  if (!inputCode || !validCodes.includes(inputCode)) {
    return Response.json({ valid: false, message: "Código incorrecto o ya utilizado." }, { status: 400 });
  }

  return Response.json({ valid: true });
}
