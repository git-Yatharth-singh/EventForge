const STATE_STYLES = {
  AVAILABLE: {
    background: "var(--surface-2)",
    border: "1px solid var(--border-strong)",
    color: "var(--text-muted)",
    cursor: "pointer",
  },
  SELECTED: {
    background: "linear-gradient(180deg, var(--violet-2), var(--violet))",
    border: "1px solid var(--violet-2)",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 0 0 3px rgba(124,92,255,0.18)",
  },
  RESERVED: {
    background: "rgba(245,166,35,0.08)",
    border: "1px solid rgba(245,166,35,0.25)",
    color: "var(--amber)",
    cursor: "not-allowed",
  },
  BOOKED: {
    background: "rgba(146,149,174,0.05)",
    border: "1px solid var(--border)",
    color: "var(--text-faint)",
    cursor: "not-allowed",
  },
};

export default function Seat({ seat, selected, onToggle }) {
  const visualState = selected ? "SELECTED" : seat.status;
  const style = STATE_STYLES[visualState] ?? STATE_STYLES.AVAILABLE;
  const disabled = seat.status === "RESERVED" || seat.status === "BOOKED";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(seat)}
      title={`Seat ${seat.seatNo} — ${visualState.toLowerCase()}`}
      className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center font-mono text-[10px] font-semibold transition-transform ${
        !disabled ? "hover:scale-110 active:scale-95" : ""
      } ${selected ? "ef-pulse" : ""}`}
      style={{
        ...style,
        borderRadius: "7px 7px 3px 3px",
      }}
    >
      {seat.seatNo.replace(/^[A-Za-z]+/, "")}
    </button>
  );
}
