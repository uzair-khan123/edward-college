"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FacultyRow = {
  id?: string;
  name: string;
  designation: string;
  department: string;
  qualification: string | null;
  photo_url: string | null;
  bio: string | null;
};

export default function FacultyForm({ initial }: { initial?: FacultyRow }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [designation, setDesignation] = useState(initial?.designation ?? "");
  const [department, setDepartment] = useState(initial?.department ?? "");
  const [qualification, setQualification] = useState(initial?.qualification ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [photoUrl, setPhotoUrl] = useState(initial?.photo_url ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const supabase = createClient();

    let finalPhotoUrl = photoUrl;

    // Only touch Storage if a new file was actually chosen.
    if (file) {
      setUploading(true);
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("faculty-photos")
        .upload(path, file, { upsert: false });
      setUploading(false);

      if (uploadError) {
        setError(`Photo upload failed: ${uploadError.message}`);
        setSaving(false);
        return;
      }
      const { data } = supabase.storage.from("faculty-photos").getPublicUrl(path);
      finalPhotoUrl = data.publicUrl;
    }

    const payload = {
      name,
      designation,
      department,
      qualification: qualification || null,
      bio: bio || null,
      photo_url: finalPhotoUrl || null,
    };

    const { error: dbError } = initial?.id
      ? await supabase.from("faculty").update(payload).eq("id", initial.id)
      : await supabase.from("faculty").insert(payload);

    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.push("/admin/faculty");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name">
          <input value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full border border-ink/20 rounded-sm px-4 py-3" />
        </Field>
        <Field label="Designation">
          <input value={designation} onChange={(e) => setDesignation(e.target.value)} required
            placeholder="e.g. Lecturer, Senior Lecturer"
            className="w-full border border-ink/20 rounded-sm px-4 py-3" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Department">
          <input value={department} onChange={(e) => setDepartment(e.target.value)} required
            placeholder="e.g. Science, Commerce"
            className="w-full border border-ink/20 rounded-sm px-4 py-3" />
        </Field>
        <Field label="Qualification">
          <input value={qualification} onChange={(e) => setQualification(e.target.value)}
            placeholder="e.g. MSc Physics"
            className="w-full border border-ink/20 rounded-sm px-4 py-3" />
        </Field>
      </div>
      <Field label="Bio (optional)">
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
          className="w-full border border-ink/20 rounded-sm px-4 py-3" />
      </Field>
      <Field label="Photo">
        {photoUrl && !file && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="Current photo" className="w-16 h-16 rounded-full object-cover mb-2" />
        )}
        <input
          type="file" accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
        <p className="text-xs text-charcoal/50 mt-1">JPG, PNG or WebP. Leave blank to keep the current photo.</p>
      </Field>

      {error && <p className="text-red-700 text-sm">{error}</p>}

      <button type="submit" disabled={saving} className="btn btn-brass disabled:opacity-60">
        {uploading ? "Uploading photo…" : saving ? "Saving…" : initial?.id ? "Save Changes" : "Add Faculty"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}
