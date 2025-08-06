import { authService } from "@/lib/services/auth/auth-service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    if (!token || !email) {
      return NextResponse.json({ ok: false, error: "Token and email are required" }, { status: 400 });
    }
    await authService.validatePasswordResetToken(token, email);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || "Failed to process request" }, { status: 500 });
  }
}
