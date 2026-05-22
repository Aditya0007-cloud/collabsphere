import { motion } from 'framer-motion';
import { CalendarDays, Check, Flame, MessageCircle, Plus, Send, Tag, Trash2, Workflow } from 'lucide-react';
import { useState } from 'react';
import EmptyState from './EmptyState';
import { formatDate } from '../utils/format';

const columns = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed' }
];

const priorityColors = {
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200',
  medium: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200',
  urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200'
};

export default function KanbanBoard({ tasks, members, onMoveTask, onCreateTask, onDeleteTask, onAddComment }) {
  const [dragged, setDragged] = useState(null);
  const [commenting, setCommenting] = useState(null);
  const [comment, setComment] = useState('');
  const [form, setForm] = useState({
    title: '',
    priority: 'medium',
    dueDate: '',
    labels: 'New',
    description: ''
  });

  const create = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    onCreateTask({
      title: form.title.trim(),
      description: form.description,
      status: 'todo',
      priority: form.priority,
      labels: form.labels.split(',').map((label) => label.trim()).filter(Boolean),
      progress: 0,
      dueDate: form.dueDate || new Date(Date.now() + 86400000 * 5).toISOString()
    });
    setForm({ title: '', priority: 'medium', dueDate: '', labels: 'New', description: '' });
  };

  const submitComment = async (event, taskId) => {
    event.preventDefault();
    if (!comment.trim()) return;
    await onAddComment(taskId, comment.trim());
    setComment('');
    setCommenting(null);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={create} className="view-shell grid gap-3 lg:grid-cols-[1.5fr_.7fr_.7fr_.9fr_auto]">
        <input className="field-light" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Task title" />
        <select className="field-light" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <input className="field-light" type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
        <input className="field-light" value={form.labels} onChange={(event) => setForm({ ...form, labels: event.target.value })} placeholder="Labels" />
        <button className="btn-primary whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Add task
        </button>
        <textarea className="field-light min-h-20 resize-none lg:col-span-5" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Task description, acceptance criteria, or context" />
      </form>

      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);
          return (
          <section
            key={column.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragged) onMoveTask(dragged, column.id);
              setDragged(null);
            }}
            className="min-h-[620px] rounded-3xl border border-slate-200/80 bg-white/55 p-3 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40"
          >
            <div className="mb-3 flex items-center justify-between px-2 py-2">
              <h2 className="font-bold">{column.title}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                {columnTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {columnTasks.length === 0 && (
                <EmptyState icon={Workflow} title="No tasks here" body={`Drop tasks into ${column.title} as the team moves work forward.`} />
              )}
              {columnTasks.map((task) => (
                <motion.article
                  key={task._id}
                  layout
                  draggable
                  onDragStart={() => setDragged(task._id)}
                  className="cursor-grab rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-panel dark:border-white/10 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold leading-6">{task.title}</h3>
                    <button className="text-slate-400 hover:text-rose-500" onClick={() => onDeleteTask(task._id)} aria-label="Delete task">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{task.description || 'No description yet.'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${priorityColors[task.priority]}`}>
                      <Flame className="h-3 w-3" />
                      {task.priority}
                    </span>
                    {task.labels?.slice(0, 2).map((label) => (
                      <span key={label} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        <Tag className="h-3 w-3" />
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${task.progress || 0}%` }} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      {task.status === 'completed' ? <Check className="h-4 w-4 text-emerald-500" /> : <CalendarDays className="h-4 w-4" />}
                      {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                    </span>
                    <button className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setCommenting(commenting === task._id ? null : task._id)}>
                      <MessageCircle className="h-4 w-4" />
                      {task.comments?.length || 0}
                    </button>
                    <div className="flex -space-x-2">
                      {(task.assignees?.length ? task.assignees : members?.slice(0, 1).map((member) => member.user)).slice(0, 3).map((assignee) => (
                        <img key={assignee?._id || assignee?.id || assignee?.email} className="h-7 w-7 rounded-full border-2 border-white dark:border-slate-900" src={assignee?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${assignee?.name}`} alt={assignee?.name} />
                      ))}
                    </div>
                  </div>
                  {commenting === task._id && (
                    <form className="mt-3 flex gap-2" onSubmit={(event) => submitComment(event, task._id)}>
                      <input className="field-light" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a comment" />
                      <button className="icon-btn shrink-0" aria-label="Send comment">
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                </motion.article>
              ))}
            </div>
          </section>
          );
        })}
      </div>
    </div>
  );
}
