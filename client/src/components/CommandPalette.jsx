import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Command, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cx } from '../utils/format';

export default function CommandPalette({ open, onClose, actions = [] }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return actions;
    return actions.filter((action) => `${action.label} ${action.description || ''}`.toLowerCase().includes(normalized));
  }, [actions, query]);

  const runAction = (action) => {
    action.onSelect?.();
    setQuery('');
    onClose?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-start bg-slate-950/45 px-3 pt-24 backdrop-blur-sm sm:px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close command palette" />
          <motion.section
            initial={{ opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-glow backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95"
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent py-2 text-base font-semibold outline-none placeholder:text-slate-400"
                placeholder="Jump to a view, ask AI, create work..."
              />
              <div className="hidden items-center gap-1 rounded-xl border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500 dark:border-white/10 sm:flex">
                <Command className="h-3.5 w-3.5" /> K
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <div className="m-2 rounded-2xl border border-dashed border-slate-200 p-6 text-center dark:border-white/10">
                  <Sparkles className="mx-auto mb-3 h-6 w-6 text-cyan-400" />
                  <p className="font-bold">No command found</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try “AI”, “tasks”, “files”, or “dashboard”.</p>
                </div>
              )}
              {filtered.map((action) => {
                const Icon = action.icon || Sparkles;
                return (
                  <button
                    key={action.id}
                    onClick={() => runAction(action)}
                    className={cx(
                      'group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-slate-100 dark:hover:bg-white/10',
                      action.highlight && 'bg-cyan-50 dark:bg-cyan-400/10'
                    )}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{action.label}</span>
                      {action.description && <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{action.description}</span>}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                  </button>
                );
              })}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
