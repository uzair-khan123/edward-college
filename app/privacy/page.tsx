import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for the Edward Model College website — what information is collected, how contact and admission form data is handled, and how student privacy is protected.",
};

const sections = [
  {
    h: "1. Introduction",
    p: [
      "This Privacy Policy explains what information the Edward Model College website may collect, how it is used, and the choices available regarding that information. This site is a student/community project built to represent Edward Model College, Balambat, Timergara, Lower Dir, KP, and has not been confirmed as the college's official, administration-operated website unless stated otherwise on the home page.",
    ],
  },
  {
    h: "2. Information this website may collect",
    p: [
      "The website is designed to collect only what is needed to respond to enquiries. Depending on how a visitor uses the site, this may include contact form details you choose to submit (name, email address, and your message), and basic technical information any web server ordinarily logs (browser type, approximate access times) used only for keeping the site secure and working correctly.",
      "This website does not ask visitors for CNIC/B-Form numbers, passwords, payment details, or other sensitive identifiers through the website itself.",
    ],
  },
  {
    h: "3. How contact and admission enquiry information is handled",
    p: [
      "Information submitted through the contact and admissions forms is used only to respond to your enquiry — for example, questions about admissions, programs, or a campus visit. It is not used for unrelated marketing and is not published anywhere on the public website.",
      "Formal admission documents (such as result cards, CNIC/B-Form copies, and photographs) are collected in person at the college office as part of the standard admission process, not through this website, and are handled under the college's own administrative record-keeping procedures.",
    ],
  },
  {
    h: "4. Cookies & analytics",
    p: [
      "This website does not currently use tracking cookies or third-party analytics services. If cookies or an analytics tool are added in the future, this section will be updated to describe what is used and how visitors can opt out.",
      "The site does load fonts from Google Fonts, which may involve a standard connection to Google's servers to deliver font files; no personal form data is sent through this connection.",
    ],
  },
  {
    h: "5. Protecting student information",
    p: [
      "Edward Model College is committed to not publicly displaying sensitive personal information about students on this website. Specifically, this site does not publish CNIC or B-Form numbers, home addresses, private personal phone numbers of individual students or staff, passwords or authentication data, or exam roll numbers linked to identifiable results.",
      "Photographs used in the Gallery section are intended to show general campus, classroom, and event life. If any individual (or a parent/guardian, for a minor) would like a specific photo reviewed or removed, please contact the college office using the details on the Contact page.",
    ],
  },
  {
    h: "6. Sharing of information with third parties",
    p: [
      "Information submitted to this website is not sold and is not shared with third parties for advertising or marketing purposes. It may only be shared where necessary to operate the site itself (for example, with a hosting provider or database service actually used to store or relay messages) or where required by law.",
    ],
  },
  {
    h: "7. Data security",
    p: [
      "The website is served over HTTPS so that data sent between a visitor's browser and the server is encrypted in transit. No secret keys, passwords, or credentials are stored in the website's front-end code, and access to submitted data is restricted by database-level security rules to authorized college staff only.",
    ],
  },
  {
    h: "8. Children's & students' privacy",
    p: [
      "Because many visitors to a college website are students, including some who may be minors, this site is designed to avoid collecting more information than necessary and to keep form fields to the minimum needed to respond to an enquiry. Parents or guardians with questions about information relating to a student may contact the college office.",
    ],
  },
  {
    h: "9. Changes to this policy",
    p: [
      'This Privacy Policy may be updated from time to time as the website and its features change. The "Last updated" date at the top of this page will reflect the most recent revision.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="wrap py-16 max-w-3xl">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> LEGAL
      </div>
      <h1 className="text-4xl mb-2">Privacy Policy</h1>
      {/* TODO: college office to confirm and fill in the real last-updated date */}
      <p className="text-charcoal/60 mb-12">
        Last updated: [Add date] · Applies to the Edward Model College website
      </p>

      <div className="space-y-10">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl mb-3">{s.h}</h2>
            {s.p.map((para, i) => (
              <p key={i} className="text-charcoal/80 mb-3 leading-relaxed">
                {para}
              </p>
            ))}
          </section>
        ))}

        <section>
          <h2 className="text-xl mb-3">10. Contact us</h2>
          <p className="text-charcoal/80 mb-3">
            Questions about this Privacy Policy or about information relating to you can be directed to
            the college office:
          </p>
          <ul className="list-disc list-inside text-charcoal/80 space-y-1">
            <li>Address: Edward Model College, Balambat, Timergara, Lower Dir, KP</li>
            <li>Email: [Update email address]</li>
            <li>Phone: [Update phone number]</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
