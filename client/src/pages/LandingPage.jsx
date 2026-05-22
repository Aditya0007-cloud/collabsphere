import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  Files,
  KanbanSquare,
  Layers3,
  LockKeyhole,
  Menu,
  MessageSquareText,
  Moon,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  UsersRound,
  Workflow,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: MessageSquareText, title: 'Realtime team chat', body: 'Channels, typing indicators, presence, mentions, and live workspace activity.' },
  { icon: KanbanSquare, title: 'Kanban execution', body: 'Prioritized task cards with due dates, assignees, labels, comments, and progress.' },
  { icon: Bell, title: 'Smart notifications', body: 'Unread badges and live alerts for tasks, messages, files, joins, and mentions.' },
  { icon: Files, title: 'File collaboration', body: 'Cloudinary-ready uploads, previews, downloads, and project assets in one place.' },
  { icon: UsersRound, title: 'Workspace roles', body: 'Admin, manager, and member-ready architecture for team collaboration.' },
  { icon: Sparkles, title: 'AI productivity', body: 'Summaries, task generation, and team productivity insights for async work.' }
];

const stats = [
  ['Live updates', 'Socket.IO'],
  ['Auth model', 'JWT + roles'],
  ['Database', 'MongoDB Atlas'],
  ['Deployment', 'Render-ready']
];

const pricing = [
  { name: 'Starter', price: '$0', body: 'For portfolio demos and small teams.', items: ['1 workspace', 'Realtime chat', 'Kanban board', 'Demo AI tools'] },
  { name: 'Team', price: '$19', body: 'For growing teams that need structure.', items: ['Unlimited projects', 'Role management', 'File hub', 'Analytics dashboard'], featured: true },
  { name: 'Scale', price: '$49', body: 'For teams that need governance.', items: ['Advanced permissions', 'Audit timeline', 'Priority support', 'Cloud storage'] }
];

export default function LandingPage() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-[#050812] dark:text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_12%,rgba(34,211,238,.20),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(244,63,94,.16),transparent_26%),linear-gradient(135deg,rgba(79,70,229,.12),transparent_36%)]" />

      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/75 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">CS</div>
            <div>
              <p className="font-bold">CollabSphere</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Realtime SaaS workspace</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 lg:flex">
            <a href="#features">Features</a>
            <a href="#collaboration">Realtime</a>
            <a href="#pricing">Pricing</a>
            <a href="#showcase">Showcase</a>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link className="btn-soft" to="/auth">Login</Link>
            <Link className="btn-primary" to="/auth">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button className="icon-btn sm:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950 sm:hidden">
            <div className="grid gap-3">
              <a href="#features" onClick={() => setMenuOpen(false)} className="btn-soft">Features</a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="btn-soft">Pricing</a>
              <Link className="btn-primary" to="/auth">Open app</Link>
            </div>
          </div>
        )}
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Built for modern async teams
          </div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-normal text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            One workspace for chat, projects, files, and team momentum.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            CollabSphere brings Slack-style communication, Trello-style execution, Notion-style team context, and analytics into a single production-ready MERN SaaS platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" to="/auth">
              Launch workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a className="btn-soft" href="#preview">
              <Play className="h-4 w-4" />
              View product preview
            </a>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-4">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 font-bold">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <ProductPreview />
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionIntro eyebrow="Product system" title="Everything a real collaboration SaaS needs." body="Recruiters should see practical product thinking: realtime flows, workspace architecture, analytics, files, notifications, and a clean operational dashboard." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.04 }}
                className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-panel backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{feature.body}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="preview" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-panel dark:border-white/10 dark:bg-white/5">
            <SectionIntro eyebrow="Dashboard preview" title="A polished command center, not a CRUD table." body="The product view includes project metrics, task distribution, priority load, deadlines, team presence, activity, and smart AI workflows." compact />
            <div className="mt-8 space-y-4">
              {['Completed tasks', 'Active users', 'Workspace activity'].map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
                  <span className="font-semibold">{item}</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">{[84, 12, 326][index]}</span>
                </div>
              ))}
            </div>
          </div>
          <ProductPreview large />
        </div>
      </section>

      <section id="collaboration" className="mx-auto grid max-w-7xl gap-5 px-4 py-20 sm:px-6 lg:grid-cols-3">
        <FeatureBand icon={MessageSquareText} title="Realtime collaboration" body="Socket.IO powers message delivery, typing indicators, presence, live task updates, and activity feed refreshes without page reloads." />
        <FeatureBand icon={UsersRound} title="Team management" body="Workspaces support invites, switching, members, and role-ready data models for Admin, Manager, and Member access." />
        <FeatureBand icon={ShieldCheck} title="Production posture" body="JWT auth, hashed passwords, CORS controls, rate limiting, helmet security headers, logging, and centralized error handling." />
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionIntro eyebrow="Pricing mockup" title="Portfolio-friendly SaaS packaging." body="Dummy pricing cards make the product feel like a real startup offering while keeping the demo free." />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {pricing.map((plan) => (
            <article key={plan.name} className={`rounded-3xl border p-6 shadow-panel ${plan.featured ? 'border-cyan-300 bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5'}`}>
              <p className="text-sm font-bold uppercase tracking-[0.18em] opacity-70">{plan.name}</p>
              <p className="mt-4 text-4xl font-bold">{plan.price}<span className="text-base font-semibold opacity-60">/mo</span></p>
              <p className="mt-3 leading-7 opacity-75">{plan.body}</p>
              <div className="mt-6 space-y-3">
                {plan.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="showcase" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-glow dark:border-white/10 dark:bg-white/5 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_.8fr]">
            <div>
              <SectionIntro eyebrow="LinkedIn showcase" title="Built to tell a stronger engineering story." body="CollabSphere now presents as a full SaaS product: public landing page, realtime workspace, analytics, task execution, file collaboration, AI tools, and Render deployment." compact />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="btn-primary" to="/auth">Open demo workspace</Link>
                <a className="btn-soft" href="https://github.com/aditya0007-cloud/collabsphere" target="_blank" rel="noreferrer">View GitHub</a>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['4.8/5 recruiter polish', '12+ SaaS features', 'Realtime-first UX', 'Render deployed'].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/40">
                  <Star className="mb-4 h-5 w-5 fill-amber-400 text-amber-400" />
                  <p className="font-bold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/70 px-4 py-10 dark:border-white/10 dark:bg-slate-950/60 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-500 dark:text-slate-400 md:flex-row">
          <p>CollabSphere - MERN realtime collaboration SaaS.</p>
          <p>Built with React, Node.js, MongoDB, Socket.IO, Tailwind, Framer Motion, and Render.</p>
        </div>
      </footer>
    </main>
  );
}

function SectionIntro({ eyebrow, title, body, compact = false }) {
  return (
    <div className={compact ? '' : 'mx-auto max-w-3xl text-center'}>
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">{title}</h2>
      <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">{body}</p>
    </div>
  );
}

function FeatureBand({ icon: Icon, title, body }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white/80 p-7 shadow-panel dark:border-white/10 dark:bg-white/5">
      <Icon className="h-7 w-7 text-cyan-500" />
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{body}</p>
    </article>
  );
}

function ProductPreview({ large = false }) {
  return (
    <motion.div
      id="product-preview"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65 }}
      className={`rounded-[2rem] border border-slate-200 bg-white/85 p-4 shadow-glow backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 ${large ? 'min-h-[520px]' : ''}`}
    >
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">Live</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
        <aside className="hidden rounded-3xl bg-slate-950 p-4 text-white dark:bg-white dark:text-slate-950 lg:block">
          <p className="mb-5 font-bold">NovaOps</p>
          {['Dashboard', 'Chat', 'Tasks', 'Files', 'AI Studio'].map((item, index) => (
            <div key={item} className={`mb-2 rounded-2xl px-3 py-2 text-sm font-semibold ${index === 0 ? 'bg-white text-slate-950 dark:bg-slate-950 dark:text-white' : 'opacity-70'}`}>
              {item}
            </div>
          ))}
        </aside>
        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [UsersRound, 'Active users', '24'],
              [CheckCircle2, 'Done tasks', '128'],
              [Clock3, 'Pending', '18']
            ].map(([Icon, label, value]) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                <Icon className="mb-3 h-5 w-5 text-cyan-500" />
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="mb-4 font-bold">Kanban board</p>
              {['Ship invite flow', 'Review security rules', 'Launch analytics'].map((task, index) => (
                <div key={task} className="mb-3 rounded-2xl bg-white p-3 text-sm font-semibold shadow-sm dark:bg-slate-900">
                  <span className={`mb-2 block h-1.5 w-12 rounded-full ${['bg-cyan-400', 'bg-amber-400', 'bg-emerald-400'][index]}`} />
                  {task}
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="mb-4 font-bold">Activity feed</p>
              {[
                [MessageSquareText, 'Maya sent a launch update'],
                [Workflow, 'Rohan moved a task to Review'],
                [LockKeyhole, 'Admin updated permissions']
              ].map(([Icon, item]) => (
                <div key={item} className="mb-3 flex items-center gap-3 rounded-2xl bg-white p-3 text-sm dark:bg-slate-900">
                  <Icon className="h-4 w-4 text-cyan-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-950 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-50">
            <div className="flex items-center gap-3">
              <Layers3 className="h-5 w-5" />
              <p className="font-bold">AI insight: Delivery velocity is up 18% this week.</p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
