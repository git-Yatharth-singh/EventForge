import { Link } from "react-router-dom";
import { CalendarRange, Building2, Armchair, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Admin dashboard</h1>
      <p className="text-[var(--text-muted)] mb-8">Manage EventForge's catalog.</p>

      <div className="rounded-[var(--radius)] border border-[rgba(245,166,35,0.25)] bg-[rgba(245,166,35,0.06)] p-4 mb-8 flex gap-3">
        <ShieldAlert size={18} color="var(--amber)" className="shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--text-muted)]">
          This admin area is only gated on the frontend. The backend does not
          currently restrict these management endpoints to the ADMIN role —
          worth hardening server-side before this goes into production.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Card to="/admin/events" icon={CalendarRange} title="Events" description="Create, edit, and remove events." />
        <Card to="/admin/venues" icon={Building2} title="Venues" description="Manage the venues events are hosted at." />
        <Card to="/admin/seats" icon={Armchair} title="Seats" description="Configure seat inventory and pricing per event." />
      </div>
    </div>
  );
}

function Card({ to, icon: Icon, title, description }) {
  return (
    <Link to={to} className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--border-strong)] transition-colors">
      <span className="w-9 h-9 rounded-lg bg-[var(--violet-dim)] flex items-center justify-center mb-4">
        <Icon size={16} color="var(--violet-2)" />
      </span>
      <h3 className="font-display font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-muted)]">{description}</p>
    </Link>
  );
}
