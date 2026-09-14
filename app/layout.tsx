import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  variable: "--font-fraunces",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

// TODO: replace with the real live domain once deployed
const siteUrl = "https://www.edwardmodelcollege.edu.pk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Edward Model College | Balambat, Timergara, Lower Dir, KP",
    template: "%s | Edward Model College",
  },
  description:
    "Edward Model College is a co-educational intermediate college in Balambat, Timergara, Lower Dir, KP — offering Pre-Medical, Pre-Engineering, ICS, Commerce and Humanities groups with separate boys' and girls' sections.",
  keywords: [
    "Edward Model College",
    "Balambat",
    "Timergara",
    "Lower Dir",
    "KP intermediate college",
    "college admissions Timergara",
  ],
  authors: [{ name: "Edward Model College" }],
  openGraph: {
    type: "website",
    siteName: "Edward Model College",
    title: "Edward Model College | Balambat, Timergara, Lower Dir, KP",
    description:
      "A co-educational intermediate college in Balambat, Timergara, Lower Dir, KP. Pre-Medical, Pre-Engineering, ICS, Commerce and Humanities groups.",
    url: siteUrl,
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edward Model College | Balambat, Timergara, Lower Dir, KP",
    description: "A co-educational intermediate college in Balambat, Timergara, Lower Dir, KP.",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%2316233A'/%3E%3Ctext x='32' y='42' font-family='Georgia,serif' font-size='30' font-weight='700' fill='%23C89B3C' text-anchor='middle'%3EE%3C/text%3E%3C/svg%3E",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        {/* Client-only helper that wires up IntersectionObserver for .reveal elements */}
        <ScrollReveal />
      </body>
    </html>
  );
}
