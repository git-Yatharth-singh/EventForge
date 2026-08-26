import Seat from "./Seat";

// Groups seats into rows using the row-letter prefix already present in
// seatNo (e.g. "A1" -> row "A"). This is derived entirely from real
// backend data (SeatResponse.seatNo) — no row/column fields are invented.
function groupIntoRows(seats) {
  const rows = new Map();
  for (const seat of seats) {
    const match = seat.seatNo.match(/^([A-Za-z]+)/);
    const rowKey = match ? match[1].toUpperCase() : "—";
    if (!rows.has(rowKey)) rows.set(rowKey, []);
    rows.get(rowKey).push(seat);
  }
  return [...rows.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([label, rowSeats]) => [
      label,
      [...rowSeats].sort((a, b) => a.seatNo.localeCompare(b.seatNo, undefined, { numeric: true })),
    ]);
}

export default function SeatMap({ seats, selectedIds, onToggle }) {
  const rows = groupIntoRows(seats);

  return (
    <div>
      {/* Stage */}
      <div className="mb-10 flex flex-col items-center">
        <div
          className="w-full max-w-md h-2.5 rounded-full mb-2"
          style={{
            background: "linear-gradient(90deg, transparent, var(--violet-2), transparent)",
            boxShadow: "0 0 40px 4px rgba(169,140,255,0.35)",
          }}
        />
        <span className="font-mono text-[11px] tracking-[0.3em] text-[var(--text-faint)] uppercase">
          Stage
        </span>
      </div>

      <div className="flex flex-col items-center gap-2 overflow-x-auto pb-2">
        {rows.map(([label, rowSeats]) => (
          <div key={label} className="flex items-center gap-2 sm:gap-2.5">
            <span className="w-4 shrink-0 font-mono text-[11px] text-[var(--text-faint)] text-right">
              {label}
            </span>
            <div className="flex gap-1.5 sm:gap-2">
              {rowSeats.map((seat) => (
                <Seat
                  key={seat.id}
                  seat={seat}
                  selected={selectedIds.includes(seat.id)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10 text-xs text-[var(--text-muted)]">
        <Legend color="var(--surface-2)" border="var(--border-strong)" label="Available" />
        <Legend color="var(--violet)" border="var(--violet-2)" label="Selected" />
        <Legend color="rgba(245,166,35,0.15)" border="rgba(245,166,35,0.4)" label="Reserved" />
        <Legend color="rgba(146,149,174,0.08)" border="var(--border)" label="Booked" />
      </div>
    </div>
  );
}

function Legend({ color, border, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="w-3.5 h-3.5"
        style={{ background: color, border: `1px solid ${border}`, borderRadius: "4px 4px 2px 2px" }}
      />
      {label}
    </span>
  );
}
