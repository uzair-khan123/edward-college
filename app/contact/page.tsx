import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="wrap py-16">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> CONTACT
      </div>
      <h1 className="text-4xl mb-10">Get in touch</h1>

      <div className="grid lg:grid-cols-2 gap-12 mb-14">
        <div className="space-y-5">
          <InfoRow k="College office" v="[Update email address]" />
          <InfoRow k="Phone" v="[Update phone number]" />
          <InfoRow k="Address" v="Edward Model College, Balambat, Timergara, Lower Dir, KP" />
          <InfoRow k="Office hours" v="Mon–Sat, 8am–2pm" />
        </div>
        <ContactForm />
      </div>

      <div className="aspect-video w-full rounded-sm overflow-hidden border border-ink/10">
        <iframe
          src="https://www.google.com/maps?q=Balambat,+Timergara,+Lower+Dir,+KP&output=embed"
          title="Map showing Balambat, Timergara, Lower Dir, KP"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-b border-ink/10 pb-3">
      <div className="mono text-xs text-charcoal/50">{k}</div>
      <div className="text-lg">{v}</div>
    </div>
  );
}
