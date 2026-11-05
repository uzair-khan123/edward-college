const categories = ["general", "admissions", "exams", "events", "holiday"];

export default function NoticeForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: { title: string; description: string; category: string; published: boolean };
}) {
  return (
    <form action={action} className="space-y-5 max-w-xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">Title</label>
        <input
          id="title" name="title" type="text" required defaultValue={defaultValues?.title}
          className="w-full border border-ink/20 rounded-sm px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1.5">Description</label>
        <textarea
          id="description" name="description" required rows={5} defaultValue={defaultValues?.description}
          className="w-full border border-ink/20 rounded-sm px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1.5">Category</label>
        <select
          id="category" name="category" defaultValue={defaultValues?.category ?? "general"}
          className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-white"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="published" name="published" type="checkbox" defaultChecked={defaultValues?.published ?? false}
          className="w-4 h-4"
        />
        <label htmlFor="published" className="text-sm">Publish immediately (visible on the public site)</label>
      </div>
      <button type="submit" className="btn btn-brass">
        {defaultValues ? "Save Changes" : "Create Notice"}
      </button>
    </form>
  );
}
