"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap py-24 text-center">
      <h1 className="text-3xl mb-4">Something went wrong</h1>
      <p className="text-charcoal/70 mb-8 max-w-md mx-auto">
        Sorry, this page ran into an unexpected error. You can try again, or head back to the homepage.
      </p>
      <div className="flex gap-4 justify-center">
        <button onClick={reset} className="btn btn-ink">
          Try again
        </button>
        <a href="/" className="btn btn-outline">
          Back home
        </a>
      </div>
    </div>
  );
}
