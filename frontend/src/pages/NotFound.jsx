import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="text-center ef-fade-up">
        <p className="font-mono text-sm text-[var(--violet-2)] mb-3">404</p>
        <h1 className="font-display text-3xl font-semibold mb-3">Page not found</h1>
        <p className="text-[var(--text-muted)] mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="px-6 py-2.5 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium">
          Back home
        </Link>
      </div>
    </div>
  );
}
