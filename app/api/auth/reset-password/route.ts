import { authService } from "@/lib/services/auth/auth-service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ ok: false, error: "Token and password are required" }, { status: 400 });
    }
    await authService.resetPassword(token, password);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || "Failed to process request" }, { status: 500 });
  }
}
