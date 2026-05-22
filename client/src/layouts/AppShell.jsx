import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BrainCircuit, CalendarClock, CheckSquare, ChevronLeft, ChevronRight, Files, Inbox, Keyboard, LayoutDashboard, LogOut, Menu, MessageSquareText, Moon, Search, Settings, Sparkles, Sun, UsersRound, X } from 'lucide-react';
import { useState } from 'react';
import { cx } from '../utils/format';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'Chat', icon: MessageSquareText },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'files', label: 'Files', icon: Files },
  { id: 'activity', label: 'Activity', icon: CalendarClock },
  { id: 'ai', label: 'AI Studio', icon: BrainCircuit }
];

export default function AppShell({
  children,
  activeView,
  setActiveView,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  workspace,
  user,
  darkMode,
  setDarkMode,
  unread,
  notifications = [],
  onMarkNotificationsRead,
  onOpenCommandPalette,
  logout
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [tourVisible, setTourVisible] = useState(() => localStorage.getItem('collabsphere_tour_seen') !== 'true');
  const showSidebarText = !collapsed || mobileOpen;
  const activeItem = navItems.find((item) => item.id === activeView) || navItems[0];

  const sidebar = (
    <aside className={cx('glass-panel flex h-full flex-col rounded-none transition-all duration-300 lg:rounded-r-3xl', collapsed ? 'lg:w-[88px]' : 'lg:w-72')}>
      <div className="flex h-20 items-center justify-between px-5">
        <button className="flex min-w-0 items-center gap-3" onClick={() => setActiveView('dashboard')}>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">CS</div>
          {showSidebarText && (
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-bold text-slate-950 dark:text-white">CollabSphere</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{workspace?.name}</p>
            </div>
          )}
        </button>
        <button className="icon-btn hidden lg:flex" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        <button className="icon-btn lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setMobileOpen(false);
              }}
              className={cx(
                'group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition',
                active ? 'bg-slate-950 text-white shadow-panel dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10',
                collapsed && !mobileOpen && 'lg:justify-center'
              )}
              title={item.label}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {showSidebarText && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 p-4">
        {showSidebarText && (
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-slate-700 dark:text-cyan-50">
            <p className="font-semibold">Invite Code</p>
            <p className="mt-1 font-mono text-lg tracking-[0.24em] text-cyan-700 dark:text-cyan-200">{workspace?.inviteCode}</p>
          </div>
        )}
        <button className="btn-soft w-full" onClick={logout}>
          <LogOut className="h-4 w-4" />
          {showSidebarText && 'Logout'}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_42%,#ecfeff_100%)] text-slate-950 dark:bg-[linear-gradient(135deg,#020617_0%,#111827_50%,#082f49_100%)] dark:text-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_12%_8%,rgba(20,184,166,.18),transparent_24%),radial-gradient(circle_at_88%_10%,rgba(244,63,94,.12),transparent_24%)]" />
      <div className="relative flex min-h-screen">
        <div className="hidden lg:block">{sidebar}</div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button className="absolute inset-0 bg-slate-950/60" onClick={() => setMobileOpen(false)} aria-label="Close overlay" />
              <motion.div className="relative h-full w-80 max-w-[86vw]" initial={{ x: -340 }} animate={{ x: 0 }} exit={{ x: -340 }}>
                {sidebar}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/60 bg-white/70 px-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button className="icon-btn lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">{activeItem.label}</p>
                <h1 className="truncate text-lg font-bold text-slate-950 dark:text-white sm:text-xl">{workspace?.name}</h1>
              </div>
            </div>
            <div className="mx-5 hidden min-w-0 flex-1 justify-center xl:flex">
              <button
                className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-left text-slate-400 shadow-sm transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
                onClick={onOpenCommandPalette}
              >
                <Search className="h-4 w-4 shrink-0" />
                <span className="truncate text-sm">Search messages, tasks, files, or teammates</span>
                <span className="ml-auto rounded-lg border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-500 dark:border-white/10">⌘K</span>
              </button>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="relative">
                <button className="icon-btn relative" aria-label="Notifications" onClick={() => setNotificationsOpen((open) => !open)}>
                  <Bell className="h-5 w-5" />
                  {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">{unread}</span>}
                </button>
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] rounded-3xl border border-slate-200 bg-white p-3 shadow-glow dark:border-white/10 dark:bg-slate-950"
                    >
                      <div className="flex items-center justify-between gap-3 px-2 py-2">
                        <div>
                          <p className="font-bold">Notifications</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{unread} unread updates</p>
                        </div>
                        <button className="btn-soft px-3 py-1.5" onClick={onMarkNotificationsRead}>Mark read</button>
                      </div>
                      <div className="mt-2 max-h-80 space-y-2 overflow-y-auto">
                        {notifications.length === 0 && (
                          <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center dark:border-white/10">
                            <Inbox className="mx-auto mb-3 h-6 w-6 text-slate-400" />
                            <p className="text-sm font-semibold">No notifications yet</p>
                          </div>
                        )}
                        {notifications.slice(0, 6).map((item) => (
                          <button
                            key={item._id}
                            onClick={() => {
                              setActiveView('activity');
                              setNotificationsOpen(false);
                            }}
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold">{item.title}</p>
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.body}</p>
                              </div>
                              {!item.read && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className="icon-btn" onClick={() => setActiveView('settings')} aria-label="Settings">
                <Settings className="h-5 w-5" />
              </button>
              <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/10 sm:flex">
                <img className="h-9 w-9 rounded-xl" src={user?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                <div className="max-w-32">
                  <p className="truncate text-sm font-semibold">{user?.name}</p>
                  <p className="flex items-center gap-1 text-xs text-emerald-500"><UsersRound className="h-3 w-3" /> Online</p>
                </div>
              </div>
            </div>
          </header>
          <main className="min-w-0 flex-1 p-3 pb-24 sm:p-6 sm:pb-6">
            <AnimatePresence>
              {tourVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="mb-4 overflow-hidden rounded-3xl border border-cyan-200 bg-white/85 shadow-panel backdrop-blur-2xl dark:border-cyan-400/20 dark:bg-slate-950/70"
                >
                  <div className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold">Welcome to the CollabSphere demo workspace</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                          Use Cmd/Ctrl+K for the command palette, Alt+1-6 to switch views, and the floating AI button for workspace recommendations.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button className="btn-soft" onClick={onOpenCommandPalette}>
                        <Keyboard className="h-4 w-4" />
                        Open Cmd+K
                      </button>
                      <button
                        className="icon-btn"
                        aria-label="Dismiss walkthrough"
                        onClick={() => {
                          localStorage.setItem('collabsphere_tour_seen', 'true');
                          setTourVisible(false);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {children}
          </main>
          <nav className="fixed bottom-3 left-3 right-3 z-30 grid grid-cols-5 gap-1 rounded-3xl border border-slate-200/80 bg-white/90 p-2 shadow-glow backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/90 lg:hidden">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  className={cx(
                    'flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-bold transition',
                    active ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-500 dark:text-slate-300'
                  )}
                  onClick={() => setActiveView(item.id)}
                  aria-label={item.label}
                >
                  <Icon className="h-4 w-4" />
                  <span className="w-full truncate">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
