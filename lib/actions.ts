"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, "Message should be at least 10 characters."),
  // honeypot - real visitors leave this blank; bots often fill every field
  website: z.string().max(0).optional(),
});

export async function submitContactForm(_prev: FormState, formData: FormData): Promise<FormState> {
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
  if (parsed.data.website) {
    // Honeypot tripped - silently "succeed" without writing anything, so the
    // bot doesn't learn its submission was rejected.
    return { status: "success", message: "Message sent — we'll reply within 2 business days." };
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
  student_name: z.string().trim().min(2, "Please enter the student's full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  class: z.string().trim().min(1, "Please select the intended class/group."),
  message: z.string().trim().max(1000).optional(),
  website: z.string().max(0).optional(),
});

export async function submitAdmissionInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
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
  if (parsed.data.website) {
    return { status: "success", message: "Inquiry received — our office will contact you soon." };
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
