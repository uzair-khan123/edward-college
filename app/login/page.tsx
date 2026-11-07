"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive URL query error and message directly from useSearchParams()
  const urlError = searchParams.get("error");
  const urlMessage = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Clear stale form errors when relevant URL query parameters change
  useEffect(() => {
    setFormError(null);
  }, [urlError, urlMessage]);

  const displayError = formError || urlError;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setFormError("Incorrect email or password. Please try again.");
      return;
    }
    router.push(searchParams.get("redirectTo") ?? "/admin");
    router.refresh();
  }

  return (
    <div className="wrap py-24 max-w-sm">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> ADMIN LOGIN
      </div>
      <h1 className="text-3xl mb-8">Sign in</h1>

      {urlMessage && (
        <div className="p-3 mb-5 text-sm bg-forest/10 border border-forest/30 text-forest rounded-sm">
          {urlMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
          <input
            id="email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/20 rounded-sm px-4 py-3"
            autoComplete="email"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <Link
              href="/forgot-password"
              className="text-xs text-brass-dim hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/20 rounded-sm px-4 py-3"
            autoComplete="current-password"
          />
        </div>
        {displayError && <p className="text-red-700 text-sm">{displayError}</p>}
        <button type="submit" disabled={loading} className="btn btn-ink w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-xs text-charcoal/50 mt-8">
        Admin accounts are created directly in the Supabase dashboard (Authentication → Users), not
        through public sign-up. Contact the site administrator for access.
      </p>
    </div>
  );
}
