"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const redirectUrl =
      typeof window !== "undefined" && window.location.origin
        ? `${window.location.origin}/auth/callback`
        : "https://edward-model-college.netlify.app/auth/callback";

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message || "Failed to send reset email. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="wrap py-24 max-w-sm">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> PASSWORD RECOVERY
      </div>
      <h1 className="text-3xl mb-4">Reset password</h1>

      {submitted ? (
        <div className="space-y-5">
          <div className="p-4 bg-forest/10 border border-forest/30 text-forest rounded-sm text-sm">
            <p className="font-semibold mb-1">Check your email</p>
            <p>
              We have sent a secure password reset link to <strong>{email}</strong>. Please check your inbox (and spam folder) and click the link to reset your password.
            </p>
          </div>
          <Link href="/login" className="btn btn-outline w-full text-center block">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-charcoal/70 mb-4">
            Enter your registered admin email address and we will send you a secure link to update your password.
          </p>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Registered Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-white"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          {error && <p className="text-red-700 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-ink w-full disabled:opacity-60"
          >
            {loading ? "Sending reset link…" : "Send Reset Link"}
          </button>

          <div className="text-center pt-2">
            <Link href="/login" className="text-xs text-brass-dim hover:underline">
              ← Back to sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
