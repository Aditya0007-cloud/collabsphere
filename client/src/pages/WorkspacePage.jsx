import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrainCircuit, CalendarClock, CheckSquare, Files, LayoutDashboard, MessageSquareText, Plus, Settings, Sparkles } from 'lucide-react';
import ActivityTimeline from '../components/ActivityTimeline';
import AiStudio from '../components/AiStudio';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import ChatPanel from '../components/ChatPanel';
import CommandPalette from '../components/CommandPalette';
import FileHub from '../components/FileHub';
import FloatingAssistant from '../components/FloatingAssistant';
import KanbanBoard from '../components/KanbanBoard';
import SettingsPanel from '../components/SettingsPanel';
import Skeleton from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import AppShell from '../layouts/AppShell';
import { api, uploadApi } from '../services/api';
import { getSocket } from '../services/socket';
import { demoActivities, demoFiles, demoMessages, demoNotifications, demoTasks, demoWorkspace } from '../utils/demoData';

export default function WorkspacePage() {
  const { user, token, demoMode, logout, logoutAll, setUser } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('collabsphere_theme') === 'dark');
  const [workspace, setWorkspace] = useState(demoMode ? demoWorkspace : null);
  const [workspaces, setWorkspaces] = useState(demoMode ? [demoWorkspace] : []);
  const [tasks, setTasks] = useState(demoMode ? demoTasks : []);
  const [messages, setMessages] = useState(demoMode ? demoMessages : []);
  const [files, setFiles] = useState(demoMode ? demoFiles : []);
  const [activities, setActivities] = useState(demoMode ? demoActivities : []);
  const [notifications, setNotifications] = useState(demoMode ? demoNotifications : []);
  const [dashboard, setDashboard] = useState(null);
  const [insights, setInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(
    demoMode
      ? [
          { title: 'Move launch blockers into Review before adding new tasks' },
          { title: 'Post a daily async standup in #general' }
        ]
      : []
  );
  const [commandOpen, setCommandOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(!demoMode);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const typingTimer = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('collabsphere_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (!isTyping && event.altKey && /^[1-6]$/.test(event.key)) {
        event.preventDefault();
        const views = ['dashboard', 'chat', 'tasks', 'files', 'activity', 'ai'];
        setActiveView(views[Number(event.key) - 1]);
      }
      if (!isTyping && event.key === '?') {
        event.preventDefault();
        setAssistantOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const loadWorkspace = useCallback(async () => {
    if (demoMode) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/workspaces');
      setWorkspaces(data.workspaces || []);
      const selected = data.workspaces?.[0];
      if (!selected) {
        setWorkspace(null);
        return;
      }
      await hydrateWorkspace(selected);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load workspace data. Check the backend URL and MongoDB connection.');
    } finally {
      setLoading(false);
    }
  }, [demoMode]);

  const hydrateWorkspace = async (selected) => {
    setWorkspace(selected);
    const workspaceId = selected._id;
    const [taskRes, messageRes, fileRes, activityRes, notificationRes, dashboardRes, insightRes, recommendationRes] = await Promise.all([
      api.get(`/tasks/${workspaceId}`),
      api.get(`/messages/${workspaceId}`),
      api.get(`/files/${workspaceId}`),
      api.get(`/activity/${workspaceId}`),
      api.get('/notifications'),
      api.get(`/analytics/${workspaceId}/dashboard`),
      api.get(`/ai/${workspaceId}/insights`),
      api.get(`/ai/${workspaceId}/recommendations`)
    ]);
    setTasks(taskRes.data.tasks);
    setMessages(messageRes.data.messages);
    setFiles(fileRes.data.files);
    setActivities(activityRes.data.activities);
    setNotifications(notificationRes.data.notifications);
    setDashboard(dashboardRes.data);
    setInsights(insightRes.data.insights);
    setRecommendations(recommendationRes.data.recommendations || []);
  };

  const switchWorkspace = async (workspaceId) => {
    if (demoMode) return;
    const selected = workspaces.find((item) => item._id === workspaceId);
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      await hydrateWorkspace(selected);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not switch workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  useEffect(() => {
    if (!token || demoMode || !workspace?._id) return undefined;
    const socket = getSocket(token);
    socket.emit('workspace:join', { workspaceId: workspace._id });

    const addMessage = (message) => setMessages((current) => (current.some((item) => item._id === message._id) ? current : [...current, message]));
    const addActivity = (activity) => setActivities((current) => [activity, ...current].slice(0, 50));
    const addFile = (file) => setFiles((current) => [file, ...current]);
    const addTask = (task) => setTasks((current) => (current.some((item) => item._id === task._id) ? current : [...current, task]));
    const updateTask = (task) => setTasks((current) => current.map((item) => (item._id === task._id ? task : item)));
    const deleteTask = ({ taskId }) => setTasks((current) => current.filter((item) => item._id !== taskId));
    const typingStart = ({ user: typingUser }) => setTypingUsers((current) => (current.includes(typingUser.name) ? current : [...current, typingUser.name]));
    const typingStop = () => setTypingUsers([]);

    socket.on('message:new', addMessage);
    socket.on('activity:new', addActivity);
    socket.on('file:new', addFile);
    socket.on('task:created', addTask);
    socket.on('task:updated', updateTask);
    socket.on('task:deleted', deleteTask);
    socket.on('typing:start', typingStart);
    socket.on('typing:stop', typingStop);

    return () => {
      socket.off('message:new', addMessage);
      socket.off('activity:new', addActivity);
      socket.off('file:new', addFile);
      socket.off('task:created', addTask);
      socket.off('task:updated', updateTask);
      socket.off('task:deleted', deleteTask);
      socket.off('typing:start', typingStart);
      socket.off('typing:stop', typingStop);
    };
  }, [token, demoMode, workspace?._id]);

  const unread = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const pushActivity = (title, type = 'task_updated') => {
    setActivities((current) => [
      { _id: crypto.randomUUID(), title, type, actor: user, createdAt: new Date().toISOString() },
      ...current
    ]);
  };

  const handleSendMessage = async (content) => {
    if (demoMode) {
      const message = { _id: crypto.randomUUID(), sender: user, content, channel: 'general', createdAt: new Date().toISOString() };
      setMessages((current) => [...current, message]);
      pushActivity(`${user.name} sent a message in #general`, 'message_sent');
      return;
    }
    const { data } = await api.post(`/messages/${workspace._id}`, { content, channel: 'general' });
    setMessages((current) => (current.some((item) => item._id === data.message._id) ? current : [...current, data.message]));
  };

  const handleTyping = () => {
    if (demoMode || !workspace?._id || !token) return;
    const socket = getSocket(token);
    socket.emit('typing:start', { workspaceId: workspace._id, channel: 'general' });
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => {
      socket.emit('typing:stop', { workspaceId: workspace._id, channel: 'general' });
    }, 900);
  };

  const handleMoveTask = async (taskId, status) => {
    const task = tasks.find((item) => item._id === taskId);
    if (!task || task.status === status) return;
    const next = { ...task, status, progress: status === 'completed' ? 100 : Math.max(task.progress || 0, status === 'review' ? 80 : status === 'in-progress' ? 45 : 10) };
    setTasks((current) => current.map((item) => (item._id === taskId ? next : item)));
    if (demoMode) {
      pushActivity(`${user.name} moved "${task.title}" to ${status.replace('-', ' ')}`, status === 'completed' ? 'task_completed' : 'task_updated');
      return;
    }
    const { data } = await api.patch(`/tasks/${workspace._id}/${taskId}`, { status: next.status, progress: next.progress });
    setTasks((current) => current.map((item) => (item._id === taskId ? data.task : item)));
  };

  const handleCreateTask = async (payload) => {
    if (demoMode) {
      const task = { _id: crypto.randomUUID(), ...payload, assignees: [workspace.members?.[0]?.user], createdAt: new Date().toISOString() };
      setTasks((current) => [task, ...current]);
      pushActivity(`${user.name} created task "${task.title}"`, 'task_created');
      return;
    }
    const { data } = await api.post(`/tasks/${workspace._id}`, payload);
    setTasks((current) => [data.task, ...current]);
  };

  const handleDeleteTask = async (taskId) => {
    setTasks((current) => current.filter((task) => task._id !== taskId));
    if (!demoMode) await api.delete(`/tasks/${workspace._id}/${taskId}`);
  };

  const handleAddTaskComment = async (taskId, body) => {
    if (demoMode) {
      setTasks((current) =>
        current.map((task) =>
          task._id === taskId
            ? {
                ...task,
                comments: [...(task.comments || []), { _id: crypto.randomUUID(), author: user, body, createdAt: new Date().toISOString() }]
              }
            : task
        )
      );
      pushActivity(`${user.name} commented on a task`, 'task_updated');
      return;
    }
    const { data } = await api.post(`/tasks/${workspace._id}/${taskId}/comments`, { body });
    setTasks((current) => current.map((task) => (task._id === taskId ? data.task : task)));
  };

  const handleAddPlanToBoard = async (plan) => {
    const subtasks = plan.subtasks || [];
    await Promise.all(
      subtasks.map((title, index) =>
        handleCreateTask({
          title,
          description: `Generated from AI prompt: ${plan.title}`,
          status: index === 0 ? 'in-progress' : 'todo',
          priority: index === 0 ? 'high' : 'medium',
          labels: ['AI Plan'],
          progress: index === 0 ? 30 : 0,
          dueDate: new Date(Date.now() + 86400000 * (index + 2)).toISOString()
        })
      )
    );
    showNotice('AI subtasks added to the board.');
  };

  const handleUploadFile = async (payload) => {
    if (demoMode) {
      const file = payload.file;
      const next = {
        _id: crypto.randomUUID(),
        originalName: file?.name || payload.originalName,
        url: file ? URL.createObjectURL(file) : payload.url,
        mimeType: file?.type || payload.mimeType,
        size: file?.size || 0,
        previewType: file?.type?.startsWith('image/') ? 'image' : 'document',
        uploadedBy: user,
        createdAt: new Date().toISOString()
      };
      setFiles((current) => [next, ...current]);
      pushActivity(`${user.name} shared ${next.originalName}`, 'file_uploaded');
      return;
    }
    const formData = new FormData();
    if (payload.file) formData.append('file', payload.file);
    Object.entries(payload).forEach(([key, value]) => {
      if (key !== 'file') formData.append(key, value);
    });
    const { data } = await uploadApi.post(`/files/${workspace._id}`, formData);
    setFiles((current) => [data.file, ...current]);
  };

  const handleSummarize = async (text) => {
    if (demoMode) return `Summary: ${text.split(/[.!?]/).filter(Boolean).slice(0, 2).join('. ')}. Key action: confirm owners, delivery date, and review path.`;
    const { data } = await api.post('/ai/summarize', { text });
    return data.summary;
  };

  const handleSmartTasks = async (prompt) => {
    if (demoMode) {
      return {
        title: prompt,
        estimatedTimeline: '3-5 working days',
        subtasks: ['Define acceptance criteria', 'Design responsive states', 'Implement core flow', 'Add validation and auth guards', 'Run deployment QA']
      };
    }
    const { data } = await api.post('/ai/smart-tasks', { prompt });
    return data.plan;
  };

  const handleMeetingNotes = async (text) => {
    if (demoMode) {
      return {
        summary: await handleSummarize(text),
        decisions: ['Ship the first responsive auth flow', 'Keep dashboard metrics visible in the first viewport'],
        actionItems: ['Assign owners', 'Confirm Friday review scope', 'Prepare deployment QA'],
        blockers: ['Waiting for final invite copy']
      };
    }
    const { data } = await api.post('/ai/meeting-notes', { text });
    return data.notes;
  };

  const handleAskAssistant = async (question) => {
    const userMessage = { id: crypto.randomUUID(), role: 'user', content: question };
    setAssistantMessages((current) => [...current, userMessage]);
    setAssistantLoading(true);

    try {
      let answer = '';
      if (demoMode) {
        const completion = tasks.length ? Math.round((tasks.filter((task) => task.status === 'completed').length / tasks.length) * 100) : 0;
        answer = `Your demo workspace is ${completion}% complete. Focus on review-ready tasks, clear blockers in #general, and move the highest priority item toward Completed before adding new scope.`;
      } else {
        const { data } = await api.post(`/ai/${workspace._id}/assistant`, { question });
        answer = data.answer;
      }
      setAssistantMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', content: answer }]);
      return answer;
    } catch (err) {
      const message = err.response?.data?.message || 'AI assistant could not answer right now.';
      setAssistantMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', content: message }]);
      return message;
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleSlashCommand = async (command) => {
    try {
      if (demoMode) {
        if (command.startsWith('/tasks')) {
          const plan = await handleSmartTasks(command.replace('/tasks', '').trim() || 'Plan next milestone');
          return `AI task plan:\n${plan.subtasks.map((item) => `- ${item}`).join('\n')}`;
        }
        return `AI update: ${await handleSummarize(messages.slice(-6).map((message) => message.content).join('\n'))}`;
      }

      const { data } = await api.post('/ai/slash-command', {
        command,
        workspaceId: workspace._id,
        text: messages.slice(-8).map((message) => message.content).join('\n')
      });
      const result = data.result;
      if (result.type === 'task_plan') {
        return `AI task plan:\n${result.content.subtasks.map((item) => `- ${item}`).join('\n')}`;
      }
      return typeof result.content === 'string' ? result.content : JSON.stringify(result.content, null, 2);
    } catch (err) {
      return err.response?.data?.message || 'AI slash command failed. Try again.';
    }
  };

  const handleSmartReply = async (thread) => {
    try {
      if (demoMode) return 'Great point. I will turn this into a tracked task and share an update after review.';
      const { data } = await api.post('/ai/smart-replies', { thread });
      return data.replies?.[0] || '';
    } catch {
      return 'Thanks, I will check this and come back with a clear update.';
    }
  };

  const handleCreateWorkspace = async (payload) => {
    if (demoMode) {
      const next = {
        ...demoWorkspace,
        _id: crypto.randomUUID(),
        name: payload.name,
        description: payload.description,
        inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
        members: [{ user, role: 'owner' }]
      };
      setWorkspaces((current) => [next, ...current]);
      setWorkspace(next);
      showNotice('Demo workspace created.');
      return;
    }
    const { data } = await api.post('/workspaces', payload);
    const detail = await api.get(`/workspaces/${data.workspace._id}`);
    setWorkspaces((current) => [detail.data.workspace, ...current]);
    await hydrateWorkspace(detail.data.workspace);
    showNotice('Workspace created.');
  };

  const handleJoinWorkspace = async (inviteCode) => {
    if (demoMode) {
      showNotice('Demo mode uses the sample invite code only.');
      return;
    }
    const { data } = await api.post('/workspaces/join', { inviteCode });
    const detail = await api.get(`/workspaces/${data.workspace._id}`);
    const list = await api.get('/workspaces');
    setWorkspaces(list.data.workspaces || []);
    await hydrateWorkspace(detail.data.workspace);
    showNotice('Joined workspace.');
  };

  const handleUpdateProfile = async (payload) => {
    if (demoMode) {
      const next = { ...user, ...payload };
      setUser(next);
      localStorage.setItem('collabsphere_user', JSON.stringify(next));
      showNotice('Profile updated in demo mode.');
      return;
    }
    const { data } = await api.patch('/users/me', payload);
    setUser(data.user);
    localStorage.setItem('collabsphere_user', JSON.stringify(data.user));
    showNotice('Profile updated.');
  };

  const handleMarkNotificationsRead = async () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    if (!demoMode) await api.patch('/notifications/read-all');
  };

  const currentWorkspace = workspace || demoWorkspace;
  const commandActions = useMemo(
    () => [
      { id: 'dashboard', label: 'Open dashboard', description: 'Analytics, progress, and workspace health', icon: LayoutDashboard, onSelect: () => setActiveView('dashboard') },
      { id: 'chat', label: 'Open team chat', description: 'Realtime channel, typing, smart replies', icon: MessageSquareText, onSelect: () => setActiveView('chat') },
      { id: 'tasks', label: 'Open Kanban board', description: 'Tasks, owners, due dates, and priorities', icon: CheckSquare, onSelect: () => setActiveView('tasks') },
      { id: 'files', label: 'Open file hub', description: 'Shared assets, previews, and uploads', icon: Files, onSelect: () => setActiveView('files') },
      { id: 'activity', label: 'Open activity stream', description: 'Live updates and notification history', icon: CalendarClock, onSelect: () => setActiveView('activity') },
      { id: 'ai', label: 'Open AI Studio', description: 'Summaries, smart tasks, and productivity insights', icon: BrainCircuit, highlight: true, onSelect: () => setActiveView('ai') },
      { id: 'assistant', label: 'Ask CollabSphere AI', description: 'Open the floating workspace copilot', icon: Sparkles, highlight: true, onSelect: () => setAssistantOpen(true) },
      {
        id: 'create-task',
        label: 'Create high-priority task',
        description: 'Adds a quick follow-up task to the board',
        icon: Plus,
        onSelect: () => {
          setActiveView('tasks');
          handleCreateTask({
            title: 'Follow up from command palette',
            description: 'Created with Cmd+K quick action.',
            status: 'todo',
            priority: 'high',
            labels: ['Quick action'],
            progress: 0
          });
        }
      },
      { id: 'settings', label: 'Workspace settings', description: 'Profile, workspace switching, and invites', icon: Settings, onSelect: () => setActiveView('settings') }
    ],
    [handleCreateTask]
  );

  const content = () => {
    if (loading) {
      return (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-36" />
            ))}
          </div>
          <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
          <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      );
    }

    if (activeView === 'chat') {
      return (
        <ChatPanel
          messages={messages}
          workspace={currentWorkspace}
          user={user}
          typingUsers={typingUsers}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onSlashCommand={handleSlashCommand}
          onSmartReply={handleSmartReply}
        />
      );
    }
    if (activeView === 'tasks') return <KanbanBoard tasks={tasks} members={currentWorkspace.members} onMoveTask={handleMoveTask} onCreateTask={handleCreateTask} onDeleteTask={handleDeleteTask} onAddComment={handleAddTaskComment} />;
    if (activeView === 'files') return <FileHub files={files} onUploadFile={handleUploadFile} />;
    if (activeView === 'activity') return <ActivityTimeline activities={activities} notifications={notifications} onMarkAllRead={handleMarkNotificationsRead} />;
    if (activeView === 'ai') return <AiStudio tasks={tasks} activities={activities} insights={insights} onSummarize={handleSummarize} onSmartTasks={handleSmartTasks} onMeetingNotes={handleMeetingNotes} onAddPlanToBoard={handleAddPlanToBoard} />;
    if (activeView === 'settings') {
      return (
        <SettingsPanel
          workspace={currentWorkspace}
          workspaces={workspaces}
          user={user}
          demoMode={demoMode}
          onSwitchWorkspace={switchWorkspace}
          onCreateWorkspace={handleCreateWorkspace}
          onJoinWorkspace={handleJoinWorkspace}
          onUpdateProfile={handleUpdateProfile}
          onLogoutAll={logoutAll}
        />
      );
    }
    return <AnalyticsDashboard dashboard={dashboard} tasks={tasks} activities={activities} />;
  };

  return (
    <AppShell
      activeView={activeView}
      setActiveView={setActiveView}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      workspace={currentWorkspace}
      user={user}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      unread={unread}
      notifications={notifications}
      onMarkNotificationsRead={handleMarkNotificationsRead}
      onOpenCommandPalette={() => setCommandOpen(true)}
      logout={logout}
    >
      <div className="space-y-4">
        {(error || notice) && (
          <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${error ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-100' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100'}`}>
            {error || notice}
          </div>
        )}
        {content()}
      </div>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} actions={commandActions} />
      <FloatingAssistant
        open={assistantOpen}
        onOpenChange={setAssistantOpen}
        messages={assistantMessages}
        recommendations={recommendations}
        loading={assistantLoading}
        onAsk={handleAskAssistant}
        onUsePrompt={(prompt) => {
          setAssistantOpen(true);
          handleAskAssistant(prompt);
        }}
      />
    </AppShell>
  );
}
