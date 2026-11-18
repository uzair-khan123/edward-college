"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

// Pakistani mobile numbers: 03XX-XXXXXXX, +923XXXXXXXXX, 00923XXXXXXXXX, etc.
const PAK_MOBILE_REGEX = /^(?:\+92|0092|0)?3[0-9]{9}$/;

const ADMISSION_GROUPS = [
  "Pre-Medical",
  "Pre-Engineering",
  "Computer Science (ICS)",
] as const;

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),
  subject: z
    .string()
    .trim()
    .max(200, "Subject cannot exceed 200 characters.")
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters.")
    .max(3000, "Message cannot exceed 3,000 characters."),
  // honeypot - real visitors leave this blank; bots often fill every field
  website: z.string().max(0).optional(),
});

export async function submitContactForm(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot fast-path: if filled by a bot, return immediate fake success
  if (formData.get("website")) {
    return { status: "success", message: "Message sent — we'll reply within 2 business days." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject || null,
    message: parsed.data.message,
  });

  if (error) {
    return { status: "error", message: "Something went wrong sending your message. Please try again shortly." };
  }
  return { status: "success", message: "Message sent — we'll reply within 2 business days." };
}

const admissionSchema = z.object({
  student_name: z
    .string()
    .trim()
    .min(2, "Please enter the student's full name.")
    .max(100, "Name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),
  phone: z
    .string()
    .trim()
    .max(25, "Phone number is too long.")
    .refine(
      (val) => PAK_MOBILE_REGEX.test(val.replace(/[\s\-\(\)\.]/g, "")),
      "Please enter a valid Pakistani mobile number (e.g. 0300-1234567 or +923001234567)."
    ),
  class: z.enum(ADMISSION_GROUPS, {
    errorMap: () => ({ message: "Please select a valid intermediate group." }),
  }),
  message: z
    .string()
    .trim()
    .max(1000, "Message cannot exceed 1,000 characters.")
    .optional(),
  website: z.string().max(0).optional(),
});

export async function submitAdmissionInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot fast-path: if filled by a bot, return immediate fake success
  if (formData.get("website")) {
    return { status: "success", message: "Inquiry received — our office will contact you soon." };
  }

  const parsed = admissionSchema.safeParse({
    student_name: formData.get("student_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    class: formData.get("class"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("admissions").insert({
    student_name: parsed.data.student_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    class: parsed.data.class,
    message: parsed.data.message || null,
  });

  if (error) {
    return { status: "error", message: "Something went wrong submitting your inquiry. Please try again shortly." };
  }
  return { status: "success", message: "Inquiry received — our office will contact you soon." };
}
