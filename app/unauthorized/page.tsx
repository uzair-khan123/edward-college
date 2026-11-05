import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="wrap py-24 text-center">
      <h1 className="text-3xl mb-4">Not authorized</h1>
      <p className="text-charcoal/70 mb-8">
        Your account doesn&apos;t have admin access. Contact the site administrator if you believe
        this is a mistake.
      </p>
      <Link href="/" className="btn btn-outline">
        Back to homepage
      </Link>
    </div>
  );
}
