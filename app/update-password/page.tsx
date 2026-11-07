"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    async function verifyRecoveryUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setHasSession(false);
          setError("No active recovery session found. Please request a new password reset link.");
        } else {
          setHasSession(true);
        }
      } catch {
        setHasSession(false);
        setError("Failed to verify recovery session. Please request a new password reset link.");
      }
    }
    verifyRecoveryUser();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Guard: password updates cannot run unless session is verified
    if (hasSession !== true) {
      setError("No verified recovery session found. Please request a new reset link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setLoading(false);
      setError(updateError.message || "Failed to update password. Please try again.");
      return;
    }

    // Security check: verify the user's role from database before navigating to /admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile && ["admin", "editor"].includes(profile.role)) {
        router.push("/admin");
        router.refresh();
        return;
      }
    }

    // Default safe fallback if not admin/editor
    router.push("/login?message=Password+updated+successfully.+Please+sign+in.");
  }

  return (
    <div className="wrap py-24 max-w-sm">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> SET NEW PASSWORD
      </div>
      <h1 className="text-3xl mb-4">Update password</h1>

      {hasSession === null ? (
        <div className="p-6 text-center text-charcoal/60 bg-parchment-2/60 border border-ink/10 rounded-sm">
          <p className="text-sm">Verifying recovery session…</p>
        </div>
      ) : hasSession === false ? (
        <div className="space-y-4">
          <p className="text-sm text-red-700 bg-red-50 p-4 border border-red-200 rounded-sm">
            {error}
          </p>
          <Link href="/forgot-password" className="btn btn-ink w-full text-center block">
            Request new reset link
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-charcoal/70 mb-4">
            Enter your new secure password below to regain access to your account.
          </p>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-white"
              autoComplete="new-password"
            />
            <p className="text-xs text-charcoal/50 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-white"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-red-700 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-ink w-full disabled:opacity-60"
          >
            {loading ? "Updating password…" : "Update Password & Continue"}
          </button>
        </form>
      )}
    </div>
  );
}
