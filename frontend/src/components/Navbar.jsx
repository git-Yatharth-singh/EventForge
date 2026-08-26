import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Ticket } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"
  }`;

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = (user?.role ?? user?.Role) === "ADMIN";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold" onClick={() => setOpen(false)}>
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--violet)] to-[var(--violet-2)] flex items-center justify-center">
            <Ticket size={16} strokeWidth={2.5} />
          </span>
          EventForge
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/events" className={navLinkClass}>Events</NavLink>
          {isAuthenticated && (
            <NavLink to="/bookings" className={navLinkClass}>My Bookings</NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-[var(--text-muted)]">
                {user?.name?.split(" ")[0] ?? "Account"}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-full border border-[var(--border-strong)] hover:bg-[var(--surface)] transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-full hover:bg-[var(--surface)] transition-colors">
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 -mr-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] px-5 py-4 flex flex-col gap-4 bg-[var(--bg)]">
          <NavLink to="/events" className={navLinkClass} onClick={() => setOpen(false)}>Events</NavLink>
          {isAuthenticated && (
            <NavLink to="/bookings" className={navLinkClass} onClick={() => setOpen(false)}>My Bookings</NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>Profile</NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>Admin</NavLink>
          )}
          <div className="h-px bg-[var(--border)] my-1" />
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-left text-sm font-medium text-[var(--rose)]">
              Log out
            </button>
          ) : (
            <>
              <Link to="/login" className={navLinkClass} onClick={() => setOpen(false)}>Log in</Link>
              <Link to="/signup" className="text-sm font-medium text-[var(--violet-2)]" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
