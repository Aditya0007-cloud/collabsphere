const splitText = (text = '') =>
  text
    .replace(/\s+/g, ' ')
    .split(/[.!?\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

export const summarizeText = async (text = '') => {
  const sentences = splitText(text);
  if (!sentences.length) return 'No meaningful content was provided to summarize.';

  const highlights = sentences.slice(0, 4);
  return `Summary: ${highlights.join('. ')}.${sentences.length > 4 ? ' Key action: align owners, timelines, and blockers before the next update.' : ''}`;
};

export const generateInsights = async ({ tasks = [], activities = [] }) => {
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const pending = tasks.length - completed;
  const overdue = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed').length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return {
    completionRate,
    completed,
    pending,
    overdue,
    suggestions: [
      overdue > 0 ? 'Prioritize overdue work and reassign blocked tasks.' : 'Keep the current delivery rhythm and protect review capacity.',
      pending > completed ? 'Break large pending tasks into smaller reviewable subtasks.' : 'Use completed work as a template for repeatable execution.',
      activities.length < 5 ? 'Increase written updates so async context stays visible.' : 'The team has healthy activity density this week.'
    ]
  };
};

export const generateSmartTasks = async (prompt = '') => {
  const normalized = prompt.trim() || 'Plan a project milestone';
  const base = normalized.replace(/^build\s+/i, '').replace(/^create\s+/i, '');
  return {
    title: normalized,
    estimatedTimeline: '3-5 working days',
    workflow: ['Discovery', 'Design', 'Implementation', 'Review', 'Launch'],
    subtasks: [
      `Define acceptance criteria for ${base}`,
      `Create UX flow and edge states for ${base}`,
      `Implement core functionality with validation`,
      `Add responsive polish and loading states`,
      `Test realtime, auth, and deployment behavior`
    ]
  };
};
