import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FacultyForm from "@/components/FacultyForm";

export default async function EditFacultyPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: faculty } = await supabase
    .from("faculty")
    .select("id, name, designation, department, qualification, photo_url, bio")
    .eq("id", params.id)
    .single();

  if (!faculty) notFound();

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-8">Edit Faculty</h1>
      <FacultyForm initial={faculty} />
    </div>
  );
}
