"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitContactForm, type FormState } from "@/lib/actions";

const initialState: FormState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-ink disabled:opacity-60">
      {pending ? "Sending…" : "Send Message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" htmlFor="name">
          <input id="name" name="name" type="text" required autoComplete="name"
            className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-white" placeholder="Your name" />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" required autoComplete="email"
            className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-white" placeholder="you@example.com" />
        </Field>
      </div>
      <Field label="Subject" htmlFor="subject">
        <input id="subject" name="subject" type="text"
          className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-white"
          placeholder="e.g. Admissions, a campus visit, financial aid" />
      </Field>
      <Field label="Message" htmlFor="message">
        <textarea id="message" name="message" required rows={5}
          className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-white"
          placeholder="Tell us a little about what you'd like to know" />
      </Field>
      {/* Honeypot spam-trap: hidden from real visitors via CSS, bots often fill it anyway */}
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
