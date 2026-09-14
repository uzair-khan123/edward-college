import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About the College" };

export default function AboutPage() {
  return (
    <div className="wrap py-16">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> ABOUT EDWARD MODEL COLLEGE
      </div>
      <h1 className="text-4xl mb-10">Serving students of Balambat and Timergara</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4 text-charcoal/85">
          <p>
            Edward Model College was founded to give students of Balambat, Timergara, and the wider
            Lower Dir area access to quality intermediate and degree-level education close to home.
          </p>
          <p>
            The college offers separate sections for boys and girls, with experienced faculty guiding
            students through their intermediate years and preparing them for board examinations and
            beyond.
          </p>
          <p>
            We focus on strong fundamentals, regular assessment, and personal attention — so every
            student is known by name, not just by roll number.
          </p>
          <Link href="/about/principal" className="inline-block text-brass-dim font-medium underline mt-4">
            Read the Principal&apos;s message →
          </Link>
        </div>
        <div className="grid gap-6">
          <Pillar num="01" title="Experienced faculty" text="Subject teachers with years of experience preparing students for board exams." />
          <Pillar num="02" title="Boys' & girls' sections" text="Separate, dedicated sections so every student learns in a comfortable environment." />
          <Pillar num="03" title="Rooted in the community" text="Located in Balambat, Timergara — accessible to students across Lower Dir." />
        </div>
      </div>
    </div>
  );
}

function Pillar({ num, title, text }: { num: string; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <span className="seal w-14 h-14 text-ink flex-shrink-0">
        <span className="font-display font-bold text-sm">{num}</span>
      </span>
      <div>
        <h2 className="font-display font-semibold text-lg mb-1">{title}</h2>
        <p className="text-sm text-charcoal/70">{text}</p>
      </div>
    </div>
  );
}
