import type { Metadata } from "next";

export const metadata: Metadata = { title: "Academics" };

// Ported directly from the original site's academics section. Update subject
// details and faculty counts to match the current prospectus.
const courses = [
  { code: "PRE · MED", name: "Pre-Medical", desc: "Physics, Chemistry, Biology and English — for students aiming toward medicine and life sciences.", meta: "Boys & Girls" },
  { code: "PRE · ENG", name: "Pre-Engineering", desc: "Physics, Chemistry, Mathematics and English — for students aiming toward engineering and technology.", meta: "Boys & Girls" },
  { code: "I · C · S", name: "Computer Science (ICS)", desc: "Computer Science, Mathematics, Physics and English for students pursuing IT and computing fields.", meta: "Boys & Girls" },
];

export default function AcademicsPage() {
  return (
    <div className="wrap py-16">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> ACADEMICS
      </div>
      <h1 className="text-4xl mb-4">Intermediate groups & subjects</h1>
      <p className="text-charcoal/70 max-w-2xl mb-12">
        Groups offered at Edward Model College, Balambat, Timergara: Pre-Medical, Pre-Engineering,
        and Computer Science.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {courses.map((c) => (
          <div key={c.code} className="border border-ink/10 rounded-sm p-6 bg-white">
            <div className="mono text-xs text-brass-dim mb-3">{c.code}</div>
            <h2 className="font-display font-semibold text-xl mb-2">{c.name}</h2>
            <p className="text-charcoal/75 text-sm mb-4">{c.desc}</p>
            <div className="mono text-xs text-charcoal/50">{c.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
