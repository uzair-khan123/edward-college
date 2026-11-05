"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitAdmissionInquiry, type FormState } from "@/lib/actions";

const initialState: FormState = { status: "idle", message: "" };

const groups = ["Pre-Medical", "Pre-Engineering", "Computer Science (ICS)"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-brass disabled:opacity-60">
      {pending ? "Submitting…" : "Submit Inquiry"}
    </button>
  );
}

export default function AdmissionForm() {
  const [state, formAction] = useFormState(submitAdmissionInquiry, initialState);

  return (
    <form action={formAction} className="space-y-5 bg-white border border-ink/10 rounded-sm p-8" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Student's full name" htmlFor="student_name">
          <input id="student_name" name="student_name" type="text" required
            className="w-full border border-ink/20 rounded-sm px-4 py-3" placeholder="Full name" />
        </Field>
        <Field label="Phone number" htmlFor="phone">
          <input id="phone" name="phone" type="tel" required
            className="w-full border border-ink/20 rounded-sm px-4 py-3" placeholder="03XX-XXXXXXX" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" required
            className="w-full border border-ink/20 rounded-sm px-4 py-3" placeholder="you@example.com" />
        </Field>
        <Field label="Intended group / class" htmlFor="class">
          <select id="class" name="class" required className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-white">
            <option value="">Select a group…</option>
            {groups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Message (optional)" htmlFor="message">
        <textarea id="message" name="message" rows={4}
          className="w-full border border-ink/20 rounded-sm px-4 py-3" placeholder="Anything you'd like the office to know" />
      </Field>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex items-center gap-4">
        <SubmitButton />
        {state.status !== "idle" && (
          <span role="status" aria-live="polite" className={state.status === "success" ? "text-forest text-sm" : "text-red-700 text-sm"}>
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
