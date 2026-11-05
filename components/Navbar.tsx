"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/departments", label: "Departments" },
  { href: "/faculty", label: "Faculty" },
  { href: "/campus-life", label: "Campus Life" },
  { href: "/gallery", label: "Gallery" },
  { href: "/notices", label: "Notices" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll and allow closing with Escape key when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-parchment/95 backdrop-blur-sm border-b border-ink/10">
      <div className="wrap flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3">
          <span className="seal text-ink w-11 h-11">
            <span className="font-display font-bold text-lg">E</span>
          </span>
          <span className="font-sans font-semibold text-ink">
            <b>Edward</b> Model College
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`transition-colors py-1 ${
                  active
                    ? "text-brass-dim font-semibold border-b-2 border-brass-dim"
                    : "hover:text-brass-dim"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/admissions" className="hidden lg:inline-flex btn btn-brass">
          Apply Now →
        </Link>

        <button
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobileMenu"
          onClick={() => setOpen(true)}
          className="lg:hidden text-2xl text-ink p-1"
        >
          ☰
        </button>
      </div>

      {/* Mobile navigation panel */}
      {open && (
        <div
          id="mobileMenu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-[60] bg-ink text-cream flex flex-col p-8 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between mb-10">
            <span className="font-sans font-semibold text-lg">
              <b>Edward</b> Model College
            </span>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="text-2xl p-1 text-cream/80 hover:text-cream"
            >
              ✕
            </button>
          </div>
          <nav className="flex flex-col gap-5 text-lg">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`transition-colors py-1 ${
                    active ? "text-brass font-semibold" : "text-cream/80 hover:text-cream"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/privacy"
              onClick={() => setOpen(false)}
              className={`transition-colors py-1 ${
                pathname === "/privacy" ? "text-brass font-semibold" : "text-cream/80 hover:text-cream"
              }`}
            >
              Privacy Policy
            </Link>
            <Link
              href="/admissions"
              onClick={() => setOpen(false)}
              className="btn btn-brass w-fit mt-4"
            >
              Apply Now →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
