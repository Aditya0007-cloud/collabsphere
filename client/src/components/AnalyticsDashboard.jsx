import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CheckCircle2, Clock3, Files, MessageSquareText, UsersRound } from 'lucide-react';
import MetricCard from './MetricCard';
import { formatDate } from '../utils/format';

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

  return (
    <div className="space-y-5">
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
        </section>
      </div>
    </div>
  );
}
