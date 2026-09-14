"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdmissionStatus, NoticeCategory } from "@/types/database";

// ---------------------------------------------------------------------------
// NOTICES
// ---------------------------------------------------------------------------
export async function createNotice(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("notices").insert({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: formData.get("category") as NoticeCategory,
    published: formData.get("published") === "on",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  revalidatePath("/");
  redirect("/admin/notices");
}

export async function updateNotice(id: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase
    .from("notices")
    .update({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: formData.get("category") as NoticeCategory,
      published: formData.get("published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  revalidatePath("/");
  redirect("/admin/notices");
}

export async function deleteNotice(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("notices").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  revalidatePath("/");
}

export async function toggleNoticePublished(id: string, published: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("notices").update({ published }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// ADMISSIONS
// ---------------------------------------------------------------------------
export async function updateAdmissionStatus(id: string, status: AdmissionStatus) {
  const supabase = createClient();
  const { error } = await supabase.from("admissions").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/admissions");
}

export async function deleteAdmission(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("admissions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/admissions");
}

// ---------------------------------------------------------------------------
// CONTACT MESSAGES
// ---------------------------------------------------------------------------
export async function deleteContactMessage(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

// ---------------------------------------------------------------------------
// FACULTY
// ---------------------------------------------------------------------------
export async function deleteFaculty(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("faculty").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faculty");
  revalidatePath("/faculty");
}

// ---------------------------------------------------------------------------
// GALLERY
// ---------------------------------------------------------------------------
export async function deleteGalleryImage(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
