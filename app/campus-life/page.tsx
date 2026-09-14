import type { Metadata } from "next";

export const metadata: Metadata = { title: "Campus Life" };

const activities = [
  { tag: "Sports", title: "Cricket & sports gala", desc: "Inter-class cricket, an annual sports gala, and regular physical education periods." },
  { tag: "Scouts", title: "College scouts unit", desc: "An active scouts programme building discipline, teamwork and community service." },
  { tag: "Societies", title: "Debate & literary society", desc: "Regular debates, speech competitions and literary events in Urdu, English and Pashto." },
  { tag: "Exams", title: "Regular assessments", desc: "Monthly tests and full-length mock exams to prepare students for board examinations." },
  { tag: "Events", title: "Annual functions", desc: "An annual prize distribution ceremony recognising top-performing students of each group." },
  { tag: "Facilities", title: "Labs & library", desc: "Science laboratories and a reading library supporting all intermediate groups." },
];

export default function CampusLifePage() {
  return (
    <div className="wrap py-16">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> CAMPUS LIFE
      </div>
      <h1 className="text-4xl mb-4">Life beyond the classroom</h1>
      <p className="text-charcoal/70 max-w-2xl mb-12">
        Sports, societies, and events that bring students of Edward Model College together.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((a) => (
          <div key={a.title} className="border border-ink/10 rounded-sm p-6 bg-white">
            <div className="mono text-xs text-brass-dim mb-3">{a.tag}</div>
            <h2 className="font-display font-semibold text-lg mb-2">{a.title}</h2>
            <p className="text-sm text-charcoal/70">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
