"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdmissionStatus, GalleryCategory, NoticeCategory } from "@/types/database";

type StaffRole = "admin" | "editor";

async function requireRole(allowedRoles: StaffRole[]) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || !allowedRoles.includes(profile.role as StaffRole)) {
    redirect("/unauthorized");
  }
  return supabase;
}

const STAFF: StaffRole[] = ["admin", "editor"];
const ADMIN: StaffRole[] = ["admin"];

function requiredText(formData: FormData, field: string, maxLength = 5000) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value || value.length > maxLength) {
    throw new Error(`Invalid ${field}.`);
  }
  return value;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

// ============================================================================
// NOTICES
// ============================================================================

export async function createNotice(formData: FormData) {
  const supabase = await requireRole(STAFF);
  const category = String(formData.get("category") ?? "general") as NoticeCategory;
  const allowed: NoticeCategory[] = ["general", "admissions", "exams", "events", "holiday"];
  if (!allowed.includes(category)) throw new Error("Invalid notice category.");

  const { error } = await supabase.from("notices").insert({
    title: requiredText(formData, "title", 200),
    description: requiredText(formData, "description"),
    category,
    published: formData.get("published") === "on",
  });
  if (error) throw new Error("Unable to create notice.");
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  revalidatePath("/");
  redirect("/admin/notices");
}

export async function updateNotice(id: string, formData: FormData) {
  const supabase = await requireRole(STAFF);
  if (!isUuid(id)) throw new Error("Invalid notice ID.");
  const category = String(formData.get("category") ?? "general") as NoticeCategory;
  const allowed: NoticeCategory[] = ["general", "admissions", "exams", "events", "holiday"];
  if (!allowed.includes(category)) throw new Error("Invalid notice category.");

  const { error } = await supabase
    .from("notices")
    .update({
      title: requiredText(formData, "title", 200),
      description: requiredText(formData, "description"),
      category,
      published: formData.get("published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error("Unable to update notice.");
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  revalidatePath("/");
  redirect("/admin/notices");
}

export async function deleteNotice(id: string) {
  const supabase = await requireRole(ADMIN);
  if (!isUuid(id)) throw new Error("Invalid notice ID.");
  const { error } = await supabase.from("notices").delete().eq("id", id);
  if (error) throw new Error("Unable to delete notice.");
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  revalidatePath("/");
}

export async function toggleNoticePublished(id: string, published: boolean) {
  const supabase = await requireRole(STAFF);
  if (!isUuid(id) || typeof published !== "boolean") throw new Error("Invalid notice update.");
  const { error } = await supabase.from("notices").update({ published }).eq("id", id);
  if (error) throw new Error("Unable to update notice.");
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  revalidatePath("/");
}

// ============================================================================
// FACULTY
// ============================================================================

export async function createFaculty(formData: FormData) {
  const supabase = await requireRole(STAFF);

  const name = requiredText(formData, "name", 150);
  const designation = requiredText(formData, "designation", 150);
  const department = requiredText(formData, "department", 150);
  const qualification = String(formData.get("qualification") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;

  let photo_url: string | null = null;
  const photoFile = formData.get("photo") as File | null;

  if (photoFile && photoFile.size > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(photoFile.type)) {
      throw new Error("Invalid photo file type. Please use JPG, PNG, or WebP.");
    }
    if (photoFile.size > 5 * 1024 * 1024) {
      throw new Error("Photo size must be less than 5MB.");
    }

    const ext = photoFile.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await photoFile.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("faculty-photos")
      .upload(path, buffer, {
        contentType: photoFile.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Photo upload failed: ${uploadError.message}`);
    }

    const { data: publicData } = supabase.storage.from("faculty-photos").getPublicUrl(path);
    photo_url = publicData.publicUrl;
  }

  const { error } = await supabase.from("faculty").insert({
    name,
    designation,
    department,
    qualification,
    bio,
    photo_url,
  });

  if (error) throw new Error("Unable to add faculty profile.");
  revalidatePath("/admin/faculty");
  revalidatePath("/faculty");
  revalidatePath("/");
  redirect("/admin/faculty");
}

export async function updateFaculty(id: string, formData: FormData) {
  const supabase = await requireRole(STAFF);
  if (!isUuid(id)) throw new Error("Invalid faculty ID.");

  const name = requiredText(formData, "name", 150);
  const designation = requiredText(formData, "designation", 150);
  const department = requiredText(formData, "department", 150);
  const qualification = String(formData.get("qualification") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;

  let photo_url: string | null = String(formData.get("current_photo_url") ?? "").trim() || null;
  const photoFile = formData.get("photo") as File | null;

  if (photoFile && photoFile.size > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(photoFile.type)) {
      throw new Error("Invalid photo file type. Please use JPG, PNG, or WebP.");
    }
    if (photoFile.size > 5 * 1024 * 1024) {
      throw new Error("Photo size must be less than 5MB.");
    }

    const ext = photoFile.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await photoFile.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("faculty-photos")
      .upload(path, buffer, {
        contentType: photoFile.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Photo upload failed: ${uploadError.message}`);
    }

    const { data: publicData } = supabase.storage.from("faculty-photos").getPublicUrl(path);
    photo_url = publicData.publicUrl;
  }

  const { error } = await supabase
    .from("faculty")
    .update({
      name,
      designation,
      department,
      qualification,
      bio,
      photo_url,
    })
    .eq("id", id);

  if (error) throw new Error("Unable to update faculty profile.");
  revalidatePath("/admin/faculty");
  revalidatePath("/faculty");
  revalidatePath("/");
  redirect("/admin/faculty");
}

export async function deleteFaculty(id: string) {
  const supabase = await requireRole(ADMIN);
  if (!isUuid(id)) throw new Error("Invalid faculty ID.");
  const { error } = await supabase.from("faculty").delete().eq("id", id);
  if (error) throw new Error("Unable to delete faculty record.");
  revalidatePath("/admin/faculty");
  revalidatePath("/faculty");
  revalidatePath("/");
}

// ============================================================================
// GALLERY
// ============================================================================

export async function createGalleryImage(formData: FormData) {
  const supabase = await requireRole(STAFF);

  const title = requiredText(formData, "title", 200);
  const description = String(formData.get("description") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "campus") as GalleryCategory;
  const allowedCategories: GalleryCategory[] = [
    "campus",
    "classrooms",
    "activities",
    "sports",
    "events",
    "staff",
  ];
  if (!allowedCategories.includes(category)) {
    throw new Error("Invalid gallery category.");
  }

  const imageFile = formData.get("image") as File | null;
  if (!imageFile || imageFile.size === 0) {
    throw new Error("Please select an image file to upload.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(imageFile.type)) {
    throw new Error("Invalid image format. Allowed formats: JPG, PNG, WebP.");
  }
  if (imageFile.size > 10 * 1024 * 1024) {
    throw new Error("Image size must be less than 10MB.");
  }

  const ext = imageFile.name.split(".").pop() || "jpg";
  const path = `${category}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await imageFile.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("gallery-images")
    .upload(path, buffer, {
      contentType: imageFile.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data: publicData } = supabase.storage.from("gallery-images").getPublicUrl(path);

  const { error } = await supabase.from("gallery").insert({
    title,
    description,
    category,
    image_url: publicData.publicUrl,
  });

  if (error) throw new Error("Unable to add gallery image.");
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  redirect("/admin/gallery");
}

export async function updateGalleryImage(id: string, formData: FormData) {
  const supabase = await requireRole(STAFF);
  if (!isUuid(id)) throw new Error("Invalid gallery ID.");

  const title = requiredText(formData, "title", 200);
  const description = String(formData.get("description") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "campus") as GalleryCategory;
  const allowedCategories: GalleryCategory[] = [
    "campus",
    "classrooms",
    "activities",
    "sports",
    "events",
    "staff",
  ];
  if (!allowedCategories.includes(category)) {
    throw new Error("Invalid gallery category.");
  }

  const { error } = await supabase
    .from("gallery")
    .update({
      title,
      description,
      category,
    })
    .eq("id", id);

  if (error) throw new Error("Unable to update gallery image details.");
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  redirect("/admin/gallery");
}

export async function deleteGalleryImage(id: string) {
  const supabase = await requireRole(ADMIN);
  if (!isUuid(id)) throw new Error("Invalid gallery ID.");
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) throw new Error("Unable to delete gallery item.");
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

// ============================================================================
// ADMISSIONS & CONTACT MESSAGES
// ============================================================================

export async function updateAdmissionStatus(id: string, status: AdmissionStatus) {
  const supabase = await requireRole(ADMIN);
  const allowed: AdmissionStatus[] = ["pending", "contacted", "accepted", "rejected"];
  if (!isUuid(id) || !allowed.includes(status)) throw new Error("Invalid admission update.");
  const { error } = await supabase.from("admissions").update({ status }).eq("id", id);
  if (error) throw new Error("Unable to update admission.");
  revalidatePath("/admin/admissions");
}

export async function deleteAdmission(id: string) {
  const supabase = await requireRole(ADMIN);
  if (!isUuid(id)) throw new Error("Invalid admission ID.");
  const { error } = await supabase.from("admissions").delete().eq("id", id);
  if (error) throw new Error("Unable to delete admission.");
  revalidatePath("/admin/admissions");
}

export async function deleteContactMessage(id: string) {
  const supabase = await requireRole(ADMIN);
  if (!isUuid(id)) throw new Error("Invalid message ID.");
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error("Unable to delete message.");
  revalidatePath("/admin/messages");
}
