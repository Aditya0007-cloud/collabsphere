import { motion } from 'framer-motion';
import { Hash, MessageSquareText, Paperclip, Pin, Send, SmilePlus, UsersRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import EmptyState from './EmptyState';
import { formatTime } from '../utils/format';

export default function ChatPanel({ messages, workspace, user, typingUsers, onSendMessage, onTyping }) {
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSendMessage(draft.trim());
    setDraft('');
  };

  const pinned = messages.filter((message) => message.pinned);

  return (
    <div className="grid min-h-[calc(100vh-9rem)] gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="view-shell flex min-h-[70vh] flex-col overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">general</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{workspace.members?.length || 0} members synced</p>
            </div>
          </div>
          <button className="btn-soft w-full sm:w-auto">
            <Pin className="h-4 w-4" />
            {pinned.length} pinned
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-5">
            {messages.length === 0 && <EmptyState icon={MessageSquareText} title="No messages yet" body="Start the channel with a product update, blocker, or mention. Messages appear live for everyone in this workspace." />}
            {messages.map((message) => {
              const mine = (message.sender?.id || message.sender?._id) === (user.id || user._id);
              return (
                <motion.div key={message._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${mine ? 'justify-end' : ''}`}>
                  {!mine && <img className="h-10 w-10 rounded-2xl" src={message.sender?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${message.sender?.name}`} alt={message.sender?.name} />}
                  <div className={`max-w-[86vw] rounded-3xl px-4 py-3 sm:max-w-[78%] ${mine ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white'}`}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-bold">{message.sender?.name}</span>
                      <span className={`text-xs ${mine ? 'text-white/60 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>{formatTime(message.createdAt)}</span>
                      {message.pinned && <Pin className="h-3.5 w-3.5 text-amber-400" />}
                    </div>
                    <p className="whitespace-pre-wrap leading-7">{message.content}</p>
                  </div>
                </motion.div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-slate-200 p-4 dark:border-white/10">
          {typingUsers.length > 0 && <p className="mb-2 text-xs font-medium text-cyan-600 dark:text-cyan-300">{typingUsers.join(', ')} typing...</p>}
          <form onSubmit={submit} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950/70">
            <button type="button" className="icon-btn border-0 bg-transparent" aria-label="Attach file"><Paperclip className="h-5 w-5" /></button>
            <input
              className="min-w-0 flex-1 bg-transparent px-2 py-2 outline-none"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                onTyping?.();
              }}
              placeholder="Message #general"
            />
            <button type="button" className="icon-btn border-0 bg-transparent" aria-label="Emoji"><SmilePlus className="h-5 w-5" /></button>
            <button className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950" aria-label="Send message"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      </section>

      <aside className="grid gap-5 xl:block xl:space-y-5">
        <section className="view-shell">
        <div className="flex items-center gap-3">
          <UsersRound className="h-5 w-5 text-cyan-500" />
          <h2 className="text-lg font-bold">Team Presence</h2>
        </div>
        <div className="mt-5 space-y-3">
          {workspace.members?.map((member) => (
            <div key={member.user?._id || member.user?.id || member.user?.email} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
              <img className="h-10 w-10 rounded-xl" src={member.user?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${member.user?.name}`} alt={member.user?.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{member.user?.name}</p>
                <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{member.role}</p>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${member.user?.status === 'offline' ? 'bg-slate-400' : member.user?.status === 'busy' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            </div>
          ))}
        </div>
        </section>
        <section className="view-shell">
          <div className="flex items-center gap-3">
            <Pin className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold">Pinned</h2>
          </div>
          <div className="mt-4 space-y-3">
            {pinned.length === 0 && <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">Pin decisions, specs, or launch notes so the channel keeps its memory.</p>}
            {pinned.map((message) => (
              <div key={message._id} className="rounded-2xl bg-amber-50 p-3 text-sm leading-6 text-amber-950 dark:bg-amber-400/10 dark:text-amber-100">
                {message.content}
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
