import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ticket, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Intentionally never send a role — the backend assigns USER when
      // role is omitted. There is no way for a normal signup form to
      // become ADMIN, by design.
      await signup({ name, email, password });
      setDone(true);
      setTimeout(() => navigate("/login"), 1600);
    } catch (err) {
      setError(friendlyMessage(err?.message));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-5">
        <div className="text-center ef-fade-up">
          <CheckCircle2 size={40} color="var(--emerald)" className="mx-auto mb-4" />
          <h1 className="font-display text-xl font-semibold mb-1">Account created</h1>
          <p className="text-sm text-[var(--text-muted)]">Taking you to log in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm ef-fade-up">
        <div className="flex justify-center mb-6">
          <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--violet)] to-[var(--violet-2)] flex items-center justify-center">
            <Ticket size={20} strokeWidth={2.5} />
          </span>
        </div>
        <h1 className="font-display text-2xl font-semibold text-center mb-1">Create your account</h1>
        <p className="text-sm text-[var(--text-muted)] text-center mb-8">
          Book seats to your next event in a few taps.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Full name" type="text" value={name} onChange={setName} autoComplete="name" required />
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
          <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" required minLength={6} />

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
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-[var(--text-muted)] text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--violet-2)] font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function friendlyMessage(raw) {
  if (!raw) return "Couldn't create your account. Please try again.";
  if (/email already exists/i.test(raw)) return "That email is already registered. Try logging in instead.";
  return raw;
}

function Field({ label, type, value, onChange, autoComplete, required, minLength }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm focus:border-[var(--violet)] outline-none transition-colors"
      />
    </label>
  );
}
