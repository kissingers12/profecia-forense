import crypto from "crypto";

// En activity_logs (user_name="INVITACION") se guarda solo el hash del token del enlace
export const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");
