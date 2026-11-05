import type { Metadata } from "next";
import AdmissionForm from "@/components/AdmissionForm";

export const metadata: Metadata = { title: "Admissions" };

export default function AdmissionsPage() {
  return (
    <div className="wrap py-16 max-w-3xl">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> ADMISSIONS
      </div>
      <h1 className="text-4xl mb-4">Apply to Edward Model College</h1>
      <p className="text-charcoal/70 mb-10">
        Submit an inquiry below and our office will get in touch with next steps. For the full
        admission requirements and fee schedule, see the prospectus.
      </p>
      <div className="mb-10">
        <a href="/prospectus.pdf" className="text-brass-dim font-medium underline">
          Download the admissions prospectus (PDF) →
        </a>
      </div>
      <AdmissionForm />
    </div>
  );
}
