import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-20 px-6">
      <div className="w-12 h-12 rounded-full bg-[rgba(251,107,107,0.1)] flex items-center justify-center">
        <AlertTriangle size={22} color="var(--rose)" />
      </div>
      <div>
        <p className="font-medium text-[var(--text)]">{message || "Something went wrong."}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-[var(--border-strong)] hover:bg-[var(--surface)] transition-colors"
        >
          <RefreshCw size={14} /> Try again
        </button>
      )}
    </div>
  );
}
