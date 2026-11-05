"use client";

import { useTransition } from "react";
import { updateAdmissionStatus } from "@/lib/admin-actions";
import type { AdmissionStatus } from "@/types/database";

const statuses: AdmissionStatus[] = ["pending", "contacted", "accepted", "rejected"];

export default function AdmissionStatusSelect({ id, current }: { id: string; current: AdmissionStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={(e) => {
        const value = e.target.value as AdmissionStatus;
        startTransition(() => {
          updateAdmissionStatus(id, value);
        });
      }}
      className="text-xs border border-ink/20 rounded-sm px-2 py-1.5 bg-white disabled:opacity-60"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
