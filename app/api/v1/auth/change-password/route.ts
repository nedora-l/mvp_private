import { authService } from "@/lib/services/auth/auth-service";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ ok: false, error: "Old and new password are required" }, { status: 400 });
    }
    if (!authHeader) {
      return NextResponse.json({ ok: false, error: "Authorization header required" }, { status: 401 });
    }
    const accessToken = authHeader.replace("Bearer ", "");
    await authService.changePassword(accessToken, oldPassword, newPassword);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || "Failed to process request" }, { status: 500 });
  }
}
