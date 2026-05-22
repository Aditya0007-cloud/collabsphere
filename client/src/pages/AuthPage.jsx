import { motion } from 'framer-motion';
import { ArrowRight, Github, LockKeyhole, Sparkles, UsersRound, Workflow } from 'lucide-react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/api';

const statRows = [
  ['Realtime channels', 'Socket.IO presence, typing, mentions'],
  ['Project command center', 'Kanban, deadlines, files, activity'],
  ['AI productivity layer', 'Summaries, insights, smart task plans']
];

export default function AuthPage() {
  const { user, login, signup, launchDemo } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/app" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const email = form.email.trim().toLowerCase();
      const password = form.password;
      if (mode === 'signup') {
        const validationError = validateSignup({ ...form, email });
        if (validationError) {
          setError(validationError);
          return;
        }
        const data = await signup({ ...form, email, name: form.name.trim() });
        setSuccess(data.message || 'Account created. Please log in to continue.');
        setMode('login');
        setForm({ name: '', email, password: '' });
      } else {
        if (!email || !password) {
          setError('Enter your email and password to log in.');
          return;
        }
        await login({ email, password });
      }
    } catch (err) {
      setError(err.response?.data?.message || `Backend API is not reachable at ${API_URL}. Start the server and make sure MongoDB is connected.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(34,211,238,.22),transparent_30%),radial-gradient(circle_at_80%_16%,rgba(244,63,94,.18),transparent_26%),linear-gradient(135deg,rgba(79,70,229,.20),transparent_38%)]" />
      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-[1.15fr_.85fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            CollabSphere
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
            Real-time team collaboration, built like a modern SaaS product.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A production-style MERN workspace for chat, Kanban execution, file sharing, activity tracking, AI planning, and operational analytics.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {statRows.map(([title, body], index) => {
              const Icon = [UsersRound, Workflow, LockKeyhole][index];
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 * index }}
                  className="rounded-2xl border border-white/10 bg-white/[.07] p-5 shadow-glow backdrop-blur-xl"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-5 w-5 text-cyan-200" />
                  </div>
                  <h2 className="font-semibold text-white">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[2rem] border border-white/10 bg-white/[.08] p-6 shadow-glow backdrop-blur-2xl">
          <div className="mb-6 flex rounded-2xl bg-slate-950/60 p-1">
            {['login', 'signup'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setMode(item);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold capitalize transition ${mode === item ? 'bg-white text-slate-950' : 'text-slate-300 hover:text-white'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <input
                className="input-field"
                placeholder="Full name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            )}
            <input
              className="input-field"
              placeholder="Email address"
              type="email"
              value={form.email}
              autoComplete="email"
              onChange={(event) => setForm({ ...form, email: event.target.value.toLowerCase() })}
            />
            <input
              className="input-field"
              placeholder="Password"
              type="password"
              value={form.password}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            {mode === 'signup' && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-300">
                Password needs 8+ characters with uppercase, lowercase, and a number. Each email can create only one CollabSphere account.
              </div>
            )}
            {success && <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{success}</p>}
            {error && <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p>}
            <button disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Connecting...' : mode === 'signup' ? 'Create account' : 'Enter workspace'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <button onClick={launchDemo} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15">
            <Github className="h-4 w-4" />
            Launch portfolio demo
          </button>
        </motion.div>
      </section>
    </main>
  );
}

function validateSignup({ name, email, password }) {
  if (!name.trim() || name.trim().length < 2) return 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must include at least one number.';
  return '';
}
