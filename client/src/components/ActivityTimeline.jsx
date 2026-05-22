import { Bell, CheckCircle2, FileUp, Inbox, MessageSquareText, UserPlus, Workflow } from 'lucide-react';
import EmptyState from './EmptyState';
import { formatTime } from '../utils/format';

const icons = {
  task_completed: CheckCircle2,
  task_created: Workflow,
  task_updated: Workflow,
  message_sent: MessageSquareText,
  file_uploaded: FileUp,
  member_joined: UserPlus,
  workspace_created: Bell
};

export default function ActivityTimeline({ activities, notifications, onMarkAllRead }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_.85fr]">
      <section className="view-shell">
        <h2 className="text-lg font-bold">Activity Timeline</h2>
        <div className="mt-5 space-y-4">
          {activities.length === 0 && <EmptyState icon={Workflow} title="No activity yet" body="Team actions, messages, uploads, and task updates will appear here as the workspace starts moving." />}
          {activities.map((activity) => {
            const Icon = icons[activity.type] || Bell;
            return (
              <div key={activity._id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{activity.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{activity.actor?.name} at {formatTime(activity.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="view-shell">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Notifications</h2>
          <button className="btn-soft" onClick={onMarkAllRead}>Mark read</button>
        </div>
        <div className="mt-5 space-y-3">
          {notifications.length === 0 && <EmptyState icon={Inbox} title="Inbox is clear" body="Mentions, task assignments, file events, and due date reminders will collect here." />}
          {notifications.map((item) => (
            <div key={item._id} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.body}</p>
                </div>
                {!item.read && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-500" />}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
