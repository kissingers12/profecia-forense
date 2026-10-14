import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return Response.json({ purchasedIds: [] });

  const { data } = await supabaseAdmin
    .from("class_purchases")
    .select("video_id")
    .eq("user_email", email.toLowerCase());

  return Response.json({ purchasedIds: (data ?? []).map((r) => r.video_id) });
}
