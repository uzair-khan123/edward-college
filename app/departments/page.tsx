import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Departments" };

const departments = [
  { name: "Science Department", covers: "Pre-Medical & Pre-Engineering groups", icon: "Sc" },
  { name: "Computer Science Department", covers: "ICS group", icon: "CS" },
];

export default function DepartmentsPage() {
  return (
    <div className="wrap py-16">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> DEPARTMENTS
      </div>
      <h1 className="text-4xl mb-4">Academic departments</h1>
      <p className="text-charcoal/70 max-w-2xl mb-12">
        See the Faculty page for individual teacher profiles once added by the college
        administration.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {departments.map((d) => (
          <div key={d.name} className="flex gap-4 border border-ink/10 rounded-sm p-6 bg-white">
            <span className="seal w-14 h-14 flex-shrink-0 text-ink">
              <span className="font-display font-bold text-sm">{d.icon}</span>
            </span>
            <div>
              <h2 className="font-display font-semibold text-lg mb-1">{d.name}</h2>
              <p className="text-sm text-charcoal/70">{d.covers}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/faculty" className="text-brass-dim font-medium underline">
          View faculty by department →
        </Link>
      </div>
    </div>
  );
}
