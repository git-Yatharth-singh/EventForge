import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Ticket } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/events";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Couldn't sign in. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm ef-fade-up">
        <div className="flex justify-center mb-6">
          <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--violet)] to-[var(--violet-2)] flex items-center justify-center">
            <Ticket size={20} strokeWidth={2.5} />
          </span>
        </div>
        <h1 className="font-display text-2xl font-semibold text-center mb-1">Welcome back</h1>
        <p className="text-sm text-[var(--text-muted)] text-center mb-8">
          Log in to browse events and manage your bookings.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
          <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />

          {error && (
            <p className="text-sm text-[var(--rose)] bg-[rgba(251,107,107,0.08)] border border-[rgba(251,107,107,0.2)] rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2.5 rounded-full bg-[var(--violet)] hover:bg-[var(--violet-2)] transition-colors font-medium disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p className="text-sm text-[var(--text-muted)] text-center mt-6">
          New to EventForge?{" "}
          <Link to="/signup" className="text-[var(--violet-2)] font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, autoComplete, required }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm focus:border-[var(--violet)] outline-none transition-colors"
      />
    </label>
  );
}
