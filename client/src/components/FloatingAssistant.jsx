import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Loader2, Send, Sparkles, Wand2, X } from 'lucide-react';
import { useState } from 'react';

export default function FloatingAssistant({ open, onOpenChange, messages = [], recommendations = [], loading, onAsk, onUsePrompt }) {
  const [question, setQuestion] = useState('What should our team focus on next?');

  const submit = async (event) => {
    event.preventDefault();
    if (!question.trim() || loading) return;
    await onAsk(question.trim());
    setQuestion('');
  };

  return (
    <>
      <button
        onClick={() => onOpenChange(!open)}
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-glow transition hover:-translate-y-1 dark:bg-white dark:text-slate-950 lg:bottom-6"
        aria-label="Open AI assistant"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed bottom-40 right-4 z-40 w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-glow dark:border-white/10 dark:bg-slate-950 lg:bottom-24"
          >
            <div className="border-b border-slate-200 bg-slate-950 p-4 text-white dark:border-white/10 dark:bg-white dark:text-slate-950">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 dark:bg-slate-950/10">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">CollabSphere AI</p>
                  <p className="text-xs opacity-70">Contextual workspace copilot</p>
                </div>
              </div>
            </div>

            <div className="max-h-[48vh] space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 dark:border-white/10">
                  <p className="text-sm font-bold">Ask about blockers, priorities, summaries, or next tasks.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['Summarize current progress', 'Find launch risks', 'Suggest next tasks'].map((prompt) => (
                      <button key={prompt} onClick={() => setQuestion(prompt)} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold transition hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15">
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`rounded-2xl p-3 text-sm leading-6 ${message.role === 'user' ? 'ml-10 bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'mr-10 bg-slate-100 dark:bg-white/10'}`}>
                  {message.content}
                </div>
              ))}

              {recommendations.length > 0 && (
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-400/20 dark:bg-cyan-400/10">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-cyan-900 dark:text-cyan-50">
                    <Wand2 className="h-4 w-4" /> Recommendations
                  </div>
                  <div className="space-y-2">
                    {recommendations.slice(0, 2).map((item) => (
                      <button key={item.title || item} onClick={() => onUsePrompt?.(item.title || item)} className="block w-full rounded-xl bg-white/70 p-2 text-left text-xs font-semibold leading-5 text-cyan-950 transition hover:bg-white dark:bg-white/10 dark:text-cyan-50">
                        {item.title || item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={submit} className="flex items-center gap-2 border-t border-slate-200 p-3 dark:border-white/10">
              <input className="field-light" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask AI about this workspace" />
              <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-white disabled:opacity-60 dark:bg-white dark:text-slate-950" disabled={loading} aria-label="Ask assistant">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
