"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/notices", label: "Notices" },
  { href: "/admin/faculty", label: "Faculty" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/admissions", label: "Admissions" },
  { href: "/admin/messages", label: "Contact Messages" },
];

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-sm text-sm transition-colors ${
              active
                ? "bg-ink text-cream font-medium"
                : "text-charcoal hover:bg-parchment-2"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
