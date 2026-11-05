import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-24 text-center">
      <div className="mono text-brass-dim text-xs mb-4">404</div>
      <h1 className="text-3xl mb-4">Page not found</h1>
      <p className="text-charcoal/70 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn btn-brass">
        Back to homepage
      </Link>
    </div>
  );
}
