import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth-actions";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  // Middleware already blocks unauthenticated users from reaching /admin at
  // all; this second check additionally verifies the *role*, so a logged-in
  // user without admin/editor role is turned away too (defense in depth).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "editor"].includes(profile.role)) {
    redirect("/unauthorized");
  }

  return (
    <div className="wrap py-10 grid lg:grid-cols-[220px_1fr] gap-10">
      <aside className="space-y-1">
        <div className="mb-6">
          <div className="font-display font-semibold">Admin Dashboard</div>
          <div className="text-sm text-charcoal/60">{profile.full_name ?? user.email}</div>
        </div>
        <AdminNav />
        <form action={signOut} className="mt-6">
          <button type="submit" className="text-sm text-red-700 underline">
            Sign out
          </button>
        </form>
      </aside>
      <div>{children}</div>
    </div>
  );
}
