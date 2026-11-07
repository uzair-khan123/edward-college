import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Strictly internal redirect bound to request.url without forwarded header spoofing
      return NextResponse.redirect(new URL("/update-password", request.url));
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=Invalid+or+expired+recovery+link", request.url)
  );
}
