import { BrainCircuit, Lightbulb, ListChecks, Plus, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function AiStudio({ tasks, activities, onSummarize, onSmartTasks, onAddPlanToBoard, insights }) {
  const [notes, setNotes] = useState('Launch login page, add protected routes, validate JWT sessions, and polish onboarding copy before Friday review.');
  const [prompt, setPrompt] = useState('Build login page');
  const [summary, setSummary] = useState('');
  const [plan, setPlan] = useState(null);
  const completion = useMemo(() => {
    const done = tasks.filter((task) => task.status === 'completed').length;
    return tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  }, [tasks]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
      <section className="view-shell">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">AI Task Summarizer</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Discussion notes, task context, meeting output</p>
          </div>
        </div>
        <textarea className="field-light mt-5 min-h-40 resize-none" value={notes} onChange={(event) => setNotes(event.target.value)} />
        <button
          className="btn-primary mt-4"
          onClick={async () => setSummary(await onSummarize(notes))}
        >
          <Sparkles className="h-4 w-4" />
          Summarize
        </button>
        {summary && <div className="mt-5 rounded-3xl border border-cyan-200 bg-cyan-50 p-5 leading-7 text-cyan-950 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-50">{summary}</div>}
      </section>

      <section className="view-shell">
        <div className="flex items-center gap-3">
          <ListChecks className="h-6 w-6 text-emerald-500" />
          <h2 className="text-lg font-bold">Smart Task Generator</h2>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <input className="field-light" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
          <button className="btn-primary shrink-0" onClick={async () => setPlan(await onSmartTasks(prompt))}>Generate</button>
        </div>
        {plan && (
          <div className="mt-5 space-y-3">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{plan.estimatedTimeline}</p>
              <button className="btn-soft" onClick={() => onAddPlanToBoard(plan)}>
                <Plus className="h-4 w-4" />
                Add to board
              </button>
            </div>
            {plan.subtasks.map((task) => (
              <div key={task} className="rounded-2xl border border-slate-200 bg-white/70 p-3 font-medium dark:border-white/10 dark:bg-white/5">{task}</div>
            ))}
          </div>
        )}
      </section>

      <section className="view-shell xl:col-span-2">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-amber-500" />
          <h2 className="text-lg font-bold">Productivity Insights</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-slate-950 p-5 text-white dark:bg-white dark:text-slate-950">
            <p className="text-sm opacity-70">Completion rate</p>
            <p className="mt-3 text-4xl font-bold">{insights?.completionRate ?? completion}%</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm text-slate-500 dark:text-slate-400">Activities tracked</p>
            <p className="mt-3 text-3xl font-bold">{activities.length}</p>
          </div>
          {(insights?.suggestions || ['Triage overdue work first.', 'Keep review capacity visible.']).slice(0, 2).map((item) => (
            <div key={item} className="rounded-3xl border border-slate-200 bg-white/70 p-5 leading-7 dark:border-white/10 dark:bg-white/5">{item}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
