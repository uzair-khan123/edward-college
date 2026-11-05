"use client";

import { useState, useTransition } from "react";
import { createFaculty, updateFaculty } from "@/lib/admin-actions";

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
  const [name, setName] = useState(initial?.name ?? "");
  const [designation, setDesignation] = useState(initial?.designation ?? "");
  const [department, setDepartment] = useState(initial?.department ?? "");
  const [qualification, setQualification] = useState(initial?.qualification ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [currentPhotoUrl] = useState(initial?.photo_url ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(initial?.photo_url ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(currentPhotoUrl || null);
    }
  }

  async function handleAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        if (initial?.id) {
          await updateFaculty(initial.id, formData);
        } else {
          await createFaculty(formData);
        }
      } catch (err) {
        // Next.js redirect() throws a special error which must not be caught as a UI error
        if (err instanceof Error && err.message === "NEXT_REDIRECT") {
          throw err;
        }
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form action={handleAction} className="space-y-5 max-w-xl">
      <input type="hidden" name="current_photo_url" value={currentPhotoUrl} />

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" htmlFor="name">
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-ink/20 rounded-sm px-4 py-3"
          />
        </Field>
        <Field label="Designation" htmlFor="designation">
          <input
            id="designation"
            name="designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
            placeholder="e.g. Lecturer, Senior Lecturer"
            className="w-full border border-ink/20 rounded-sm px-4 py-3"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Department" htmlFor="department">
          <input
            id="department"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            placeholder="e.g. Science, Computer Science"
            className="w-full border border-ink/20 rounded-sm px-4 py-3"
          />
        </Field>
        <Field label="Qualification" htmlFor="qualification">
          <input
            id="qualification"
            name="qualification"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            placeholder="e.g. MSc Physics, MS Computer Science"
            className="w-full border border-ink/20 rounded-sm px-4 py-3"
          />
        </Field>
      </div>

      <Field label="Bio (optional)" htmlFor="bio">
        <textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full border border-ink/20 rounded-sm px-4 py-3"
        />
      </Field>

      <Field label="Photo" htmlFor="photo">
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Faculty preview"
            className="w-16 h-16 rounded-full object-cover mb-2 border border-ink/20"
          />
        )}
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="text-sm"
        />
        <p className="text-xs text-charcoal/50 mt-1">
          JPG, PNG or WebP (max 5MB). Leave blank to keep current photo.
        </p>
      </Field>

      {error && <p className="text-red-700 text-sm font-medium">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-brass disabled:opacity-60"
      >
        {isPending
          ? "Saving…"
          : initial?.id
          ? "Save Changes"
          : "Add Faculty"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
