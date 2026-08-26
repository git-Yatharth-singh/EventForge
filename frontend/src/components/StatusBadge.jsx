const STYLES = {
  PENDING: { bg: "rgba(245,166,35,0.12)", fg: "var(--amber)", label: "Pending" },
  CONFIRMED: { bg: "rgba(52,211,153,0.12)", fg: "var(--emerald)", label: "Confirmed" },
  CANCELLED: { bg: "rgba(146,149,174,0.14)", fg: "var(--text-muted)", label: "Cancelled" },
  FAILED: { bg: "rgba(251,107,107,0.12)", fg: "var(--rose)", label: "Failed" },
  EXPIRED: { bg: "rgba(146,149,174,0.14)", fg: "var(--text-muted)", label: "Expired" },
  SUCCESS: { bg: "rgba(52,211,153,0.12)", fg: "var(--emerald)", label: "Success" },
};

export default function StatusBadge({ status }) {
  const s = STYLES[status] ?? { bg: "rgba(146,149,174,0.14)", fg: "var(--text-muted)", label: status };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium tracking-wide"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.fg }} />
      {s.label.toUpperCase()}
    </span>
  );
}
