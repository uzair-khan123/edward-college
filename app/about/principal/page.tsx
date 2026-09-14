import type { Metadata } from "next";

export const metadata: Metadata = { title: "Principal's Message" };

export default function PrincipalMessagePage() {
  return (
    <div className="wrap py-16 max-w-2xl">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> ABOUT
      </div>
      <h1 className="text-4xl mb-10">Principal&apos;s Message</h1>

      <div className="flex gap-5 mb-8">
        <span className="seal w-16 h-16 flex-shrink-0 text-ink">
          <span className="font-display font-bold">P</span>
        </span>
        <div>
          <div className="mono text-xs text-brass-dim mb-1">Principal</div>
          {/* Intentionally left as a placeholder - real name and message
              must come from the college administration, not invented here. */}
          <h2 className="font-display font-semibold text-lg">[Name to be added]</h2>
        </div>
      </div>

      <div className="border border-dashed border-ink/20 rounded-sm p-8 text-charcoal/60 bg-parchment-2/60">
        <p>
          [The Principal&apos;s message will be added here once provided by the college
          administration. This section is intentionally left blank rather than filled with invented
          text.]
        </p>
      </div>
    </div>
  );
}
