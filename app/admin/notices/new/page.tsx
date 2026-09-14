import NoticeForm from "@/components/NoticeForm";
import { createNotice } from "@/lib/admin-actions";

export default function NewNoticePage() {
  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-8">New Notice</h1>
      <NoticeForm action={createNotice} />
    </div>
  );
}
