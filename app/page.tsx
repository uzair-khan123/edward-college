import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  // Latest 3 published notices for the homepage preview.
  // Falls back to an empty list gracefully if Supabase isn't configured yet.
  let notices: { id: string; title: string; category: string; created_at: string }[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("notices")
      .select("id, title, category, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3);
    notices = data ?? [];
  } catch {
    // Supabase env vars not set yet during initial setup - homepage still renders.
  }

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="pt-16 pb-24">
        <div className="wrap grid lg:grid-cols-[3fr_2fr] gap-16 items-center">
          <div>
            <div className="mono text-brass text-xs mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-brass" /> BALAMBAT, TIMERGARA — LOWER DIR, KP
            </div>
            <h1 className="text-4xl sm:text-5xl leading-tight mb-6">
              Learn with purpose.
              <br />
              Compete with honesty.
              <br />
              <em className="italic font-normal">Lead your community.</em>
            </h1>
            <p className="text-lg text-charcoal/80 max-w-lg mb-8">
              Edward Model College is a co-educational institution in Balambat, Timergara, offering
              intermediate and degree-level education to students from across Lower Dir.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/admissions" className="btn btn-brass">
                Apply Now →
              </Link>
              <Link href="/academics" className="btn btn-outline">
                Explore Programs
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-5 border-l border-ink/10 pl-8">
            {/* NOTE: these figures came from the original site's placeholder hero
                stats. Replace with the real, current numbers from the college
                office before launch - do not treat these as verified. */}
            <Stat num="620" label="Students currently enrolled" />
            <Stat num="22" label="Teaching faculty, boys' & girls' sections" />
            <Stat num="3" label="Intermediate groups offered" />
            <Stat num="2015" label="Year the college was established" />
          </div>
        </div>
      </section>

      {/* ---------- ABOUT ---------- */}
      <section className="py-20 bg-parchment-2/60" id="about">
        <div className="wrap">
          <SectionHead eyebrow="ABOUT EDWARD MODEL COLLEGE" title="Serving students of Balambat and Timergara" />
          <div className="grid lg:grid-cols-2 gap-12 mt-10">
            <div className="reveal space-y-4 text-charcoal/85">
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
            </div>
            <div className="reveal grid gap-6">
              <Pillar num="01" title="Experienced faculty" text="Subject teachers with years of experience preparing students for board exams." />
              <Pillar num="02" title="Boys' & girls' sections" text="Separate, dedicated sections so every student learns in a comfortable environment." />
              <Pillar num="03" title="Rooted in the community" text="Located in Balambat, Timergara — accessible to students across Lower Dir." />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ACADEMICS PREVIEW ---------- */}
      <section className="py-20 bg-ink text-cream" id="academics">
        <div className="wrap">
          <SectionHead
            dark
            eyebrow="ACADEMICS"
            title="Intermediate groups & subjects"
            sub="Groups offered at Edward Model College, Balambat, Timergara. See the full Academics page for subject details."
          />
          <div className="mt-10">
            <Link href="/academics" className="btn btn-brass">
              View all academic groups →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- NOTICES PREVIEW ---------- */}
      <section className="py-20" id="notices">
        <div className="wrap">
          <SectionHead eyebrow="NOTICES" title="Latest announcements" />
          <div className="grid sm:grid-cols-3 gap-6 mt-10">
            {notices.length > 0 ? (
              notices.map((n) => (
                <div key={n.id} className="reveal border border-ink/10 rounded-sm p-6 bg-white">
                  <div className="mono text-brass-dim text-xs mb-2">{n.category}</div>
                  <h3 className="font-display font-semibold text-lg mb-1">{n.title}</h3>
                  <p className="text-sm text-charcoal/60">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-charcoal/60 col-span-3">
                No notices published yet — connect Supabase and add notices from the admin dashboard.
              </p>
            )}
          </div>
          <div className="mt-8">
            <Link href="/notices" className="text-brass-dim font-medium underline">
              View all notices →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- ADMISSIONS CTA ---------- */}
      <section className="py-20 bg-forest text-cream" id="admissions">
        <div className="wrap text-center">
          <h2 className="text-3xl mb-4">Ready to apply?</h2>
          <p className="max-w-xl mx-auto mb-8 text-cream/80">
            Submit an admission inquiry and our office will get in touch with next steps.
          </p>
          <Link href="/admissions" className="btn btn-brass">
            Start Admission Inquiry →
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div className="font-display font-bold text-3xl text-ink">{num}</div>
      <div className="text-sm text-charcoal/60">{label}</div>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
  dark,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  dark?: boolean;
}) {
  return (
    <div className="reveal max-w-2xl">
      <div className={`mono text-xs mb-3 flex items-center gap-2 ${dark ? "text-brass" : "text-brass-dim"}`}>
        <span className="w-6 h-px bg-current" /> {eyebrow}
      </div>
      <h2 className="text-3xl">{title}</h2>
      {sub && <p className={`mt-3 ${dark ? "text-cream/70" : "text-charcoal/70"}`}>{sub}</p>}
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
        <h3 className="font-display font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-charcoal/70">{text}</p>
      </div>
    </div>
  );
}
