import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, CalendarRange, Building2, Armchair, ArrowLeft } from "lucide-react";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-[var(--violet-dim)] text-[var(--text)]"
      : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
  }`;

export default function AdminLayout() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-[220px_1fr] gap-8">
      <aside>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)] mb-6">
          <ArrowLeft size={12} /> Back to site
        </Link>
        <p className="font-mono text-xs text-[var(--text-faint)] uppercase tracking-wide mb-3 px-1">Admin</p>
        <nav className="flex flex-col gap-1">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/admin/events" className={linkClass}>
            <CalendarRange size={16} /> Events
          </NavLink>
          <NavLink to="/admin/venues" className={linkClass}>
            <Building2 size={16} /> Venues
          </NavLink>
          <NavLink to="/admin/seats" className={linkClass}>
            <Armchair size={16} /> Seats
          </NavLink>
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
