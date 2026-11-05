import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream mt-24">
      <div className="wrap py-16 grid gap-12 lg:grid-cols-[2fr_3fr]">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="seal w-14 h-14">
              <span className="font-display font-bold text-xl">E</span>
            </span>
            <div>
              <div className="font-display font-semibold">Edward Model College KP</div>
              <div className="text-sm text-cream/70">Balambat, Timergara — Lower Dir, KP</div>
            </div>
          </div>
          {/* Social links: placeholders until the college office confirms real accounts */}
          <div className="flex gap-4 mt-4 text-cream/80">
            <a href="#" aria-label="Facebook (link to be added)">
              Facebook
            </a>
            <a href="#" aria-label="Instagram (link to be added)">
              Instagram
            </a>
            <a href="#" aria-label="YouTube (link to be added)">
              YouTube
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
          <div className="flex flex-col gap-3">
            <h4 className="mono text-brass text-xs mb-1">Explore</h4>
            <Link href="/about">About</Link>
            <Link href="/academics">Academics</Link>
            <Link href="/faculty">Faculty</Link>
            <Link href="/gallery">Gallery</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="mono text-brass text-xs mb-1">More</h4>
            <Link href="/campus-life">Campus Life</Link>
            <Link href="/notices">Notices</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="mono text-brass text-xs mb-1">Apply</h4>
            <Link href="/admissions">Admissions</Link>
            <a href="/prospectus.pdf">Prospectus</a>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="mono text-brass text-xs mb-1">Contact</h4>
            {/* Intentionally left as placeholders - the college office must
                supply the real phone number and email before launch. */}
            <span className="text-cream/70">[Update email address]</span>
            <span className="text-cream/70">[Update phone number]</span>
          </div>
        </div>
      </div>
      <div className="wrap py-6 border-t border-cream/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-cream/60">
        <span>© {new Date().getFullYear()} Edward Model College KP. All Rights Reserved.</span>
        <span>Student project website — not confirmed as the college&apos;s official site.</span>
      </div>
    </footer>
  );
}
