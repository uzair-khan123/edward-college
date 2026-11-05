export default function Loading() {
  return (
    <div className="wrap py-24 flex items-center justify-center">
      <div className="mono text-xs text-charcoal/50 flex items-center gap-3">
        <span className="w-4 h-4 border-2 border-brass border-t-transparent rounded-full animate-spin" />
        Loading…
      </div>
    </div>
  );
}
