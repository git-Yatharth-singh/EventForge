import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-2 font-display text-base font-semibold">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--violet)] to-[var(--violet-2)] flex items-center justify-center">
            <Ticket size={14} strokeWidth={2.5} />
          </span>
          EventForge
        </div>
        <p className="text-sm text-[var(--text-faint)] max-w-md">
          Seat reservations are held for 10 minutes via Redis while you pay.
          Payment on EventForge is a simulated checkout — no real charge is made.
        </p>
        <div className="flex gap-6 text-sm text-[var(--text-muted)]">
          <Link to="/events" className="hover:text-[var(--text)]">Events</Link>
          <Link to="/bookings" className="hover:text-[var(--text)]">My Bookings</Link>
        </div>
      </div>
    </footer>
  );
}
