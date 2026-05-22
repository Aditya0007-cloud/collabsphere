import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CheckCircle2, Clock3, Files, MessageSquareText, Sparkles, TrendingUp, UsersRound, Zap } from 'lucide-react';
import MetricCard from './MetricCard';
import { formatDate } from '../utils/format';
import EmptyState from './EmptyState';

const velocity = [
  { day: 'Mon', completed: 6, focus: 74 },
  { day: 'Tue', completed: 8, focus: 79 },
  { day: 'Wed', completed: 5, focus: 71 },
  { day: 'Thu', completed: 10, focus: 86 },
  { day: 'Fri', completed: 7, focus: 82 },
  { day: 'Sat', completed: 4, focus: 66 },
  { day: 'Sun', completed: 5, focus: 70 }
];

const colors = ['#06b6d4', '#4f46e5', '#f59e0b', '#10b981'];

export default function AnalyticsDashboard({ dashboard, tasks, activities }) {
  const metrics = dashboard?.metrics || {
    activeUsers: 0,
    completedTasks: tasks.filter((task) => task.status === 'completed').length,
    pendingTasks: tasks.filter((task) => task.status !== 'completed').length,
    messages: 0,
    files: 0
  };

  const byStatus = dashboard?.charts?.byStatus || ['todo', 'in-progress', 'review', 'completed'].map((status) => ({
    name: status.replace('-', ' '),
    value: tasks.filter((task) => task.status === status).length
  }));

  const priority = dashboard?.charts?.priority || ['low', 'medium', 'high', 'urgent'].map((item) => ({
    name: item,
    value: tasks.filter((task) => task.priority === item).length
  }));

  const upcoming = dashboard?.upcoming?.length ? dashboard.upcoming : tasks.filter((task) => task.dueDate && task.status !== 'completed').slice(0, 5);
  const completionRate = tasks.length ? Math.round((metrics.completedTasks / tasks.length) * 100) : 0;
  const heatmap = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => ({
    day,
    value: velocity[index]?.focus || 60
  }));

  return (
    <div className="space-y-5">
      <section className="view-shell overflow-hidden">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              Executive workspace overview
            </div>
            <h2 className="text-2xl font-bold tracking-normal sm:text-3xl">Team momentum is visible in one place.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Track delivery health, priority load, upcoming deadlines, and collaboration activity without jumping between tools.
            </p>
          </div>
          <div className="grid min-w-[260px] gap-3 rounded-3xl bg-slate-950 p-4 text-white dark:bg-white dark:text-slate-950">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-70">Completion health</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{completionRate}%</span>
              <span className="mb-1 rounded-full bg-emerald-400/15 px-2 py-1 text-xs font-bold text-emerald-300 dark:text-emerald-600">+18%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10 dark:bg-slate-950/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-indigo-400 to-emerald-300" style={{ width: `${Math.max(8, completionRate)}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Active users" value={metrics.activeUsers} icon={UsersRound} accent="bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200" detail="Live workspace seats" />
        <MetricCard title="Completed" value={metrics.completedTasks} icon={CheckCircle2} accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200" detail="Delivery throughput" />
        <MetricCard title="Pending" value={metrics.pendingTasks} icon={Clock3} accent="bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200" detail="Open execution queue" />
        <MetricCard title="Messages" value={metrics.messages} icon={MessageSquareText} accent="bg-indigo-100 text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-200" detail="Team conversations" />
        <MetricCard title="Files" value={metrics.files} icon={Files} accent="bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200" detail="Shared assets" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="view-shell">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Productivity Pulse</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Completion velocity and focus quality</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">+18% week</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocity}>
                <defs>
                  <linearGradient id="completed" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(148,163,184,.25)' }} />
                <Area type="monotone" dataKey="completed" stroke="#06b6d4" strokeWidth={3} fill="url(#completed)" />
                <Area type="monotone" dataKey="focus" stroke="#4f46e5" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="view-shell">
          <h2 className="text-lg font-bold">Task Distribution</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byStatus} innerRadius={58} outerRadius={92} paddingAngle={4} dataKey="value">
                  {byStatus.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {byStatus.map((item, index) => (
              <div key={item.name} className="rounded-2xl border border-slate-200 bg-white/70 p-3 text-sm dark:border-white/10 dark:bg-white/5">
                <span className="mb-2 block h-2 w-8 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                <p className="font-semibold capitalize">{item.name}</p>
                <p className="text-slate-500 dark:text-slate-400">{item.value} tasks</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
        <section className="view-shell">
          <h2 className="text-lg font-bold">Upcoming Deadlines</h2>
          <div className="mt-4 space-y-3">
            {upcoming.length === 0 && (
              <EmptyState icon={Clock3} title="No deadlines at risk" body="Tasks with upcoming due dates will appear here, keeping review and delivery pressure visible." />
            )}
            {upcoming.map((task) => (
              <div key={task._id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{task.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(task.dueDate)}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold capitalize text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">{task.priority}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="view-shell">
          <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
            <div>
              <h2 className="text-lg font-bold">Priority Load</h2>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priority}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ borderRadius: 16 }} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#f43f5e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <p className="font-bold">Focus heatmap</p>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {heatmap.map((item) => (
                  <div key={item.day} className="space-y-2 text-center">
                    <div
                      className="h-24 rounded-xl transition hover:-translate-y-1"
                      style={{
                        background: `linear-gradient(180deg, rgba(34,211,238,${item.value / 100}) 0%, rgba(99,102,241,${item.value / 140}) 100%)`
                      }}
                    />
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.day}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">Visualizes weekly focus quality for better screenshot-ready analytics.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
