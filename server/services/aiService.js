import { env } from '../config/env.js';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

const splitText = (text = '') =>
  text
    .replace(/\s+/g, ' ')
    .split(/[.!?\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

const compactTask = (task = {}) => ({
  title: task.title,
  status: task.status,
  priority: task.priority,
  progress: task.progress,
  dueDate: task.dueDate,
  labels: task.labels
});

const compactActivity = (activity = {}) => ({
  title: activity.title,
  type: activity.type,
  createdAt: activity.createdAt
});

const compactMessage = (message = {}) => ({
  sender: message.sender?.name || message.sender,
  content: message.content,
  createdAt: message.createdAt
});

const extractResponseText = (payload = {}) => {
  if (payload.output_text) return payload.output_text;
  const blocks = payload.output || [];
  return blocks
    .flatMap((item) => item.content || [])
    .map((content) => content.text || '')
    .filter(Boolean)
    .join('\n')
    .trim();
};

const parseJson = (value, fallback) => {
  try {
    const cleaned = value.replace(/^```json/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
};

const callOpenAI = async ({ system, user, json = false }) => {
  if (!env.openaiApiKey) return '';

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: env.openaiModel,
        instructions: system,
        input: user,
        text: json
          ? {
              format: {
                type: 'json_object'
              }
            }
          : undefined
      })
    });

    if (!response.ok) {
      const body = await response.text();
      console.warn(`OpenAI request failed: ${response.status} ${body.slice(0, 200)}`);
      return '';
    }

    const data = await response.json();
    return extractResponseText(data);
  } catch (error) {
    console.warn(`OpenAI request failed: ${error.message}`);
    return '';
  }
};

export const summarizeText = async (text = '') => {
  const sentences = splitText(text);
  if (!sentences.length) return 'No meaningful content was provided to summarize.';

  const aiSummary = await callOpenAI({
    system: 'You are CollabSphere AI. Summarize team collaboration content for busy product teams. Be concise, action-oriented, and specific.',
    user: `Summarize this into 3 bullets and 1 clear next action:\n\n${text}`
  });
  if (aiSummary) return aiSummary;

  const highlights = sentences.slice(0, 4);
  return `Summary: ${highlights.join('. ')}.${sentences.length > 4 ? ' Key action: align owners, timelines, and blockers before the next update.' : ''}`;
};

export const generateInsights = async ({ tasks = [], activities = [] }) => {
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const pending = tasks.length - completed;
  const overdue = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed').length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const fallback = {
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

  const text = await callOpenAI({
    json: true,
    system: 'You are CollabSphere AI. Return only valid JSON for SaaS workspace productivity insights.',
    user: `Return JSON with keys completionRate, completed, pending, overdue, suggestions (array of 3 short strings), riskLevel (low|medium|high), focusArea. Workspace data: ${JSON.stringify({
      tasks: tasks.slice(0, 50).map(compactTask),
      activities: activities.slice(0, 30).map(compactActivity),
      metrics: fallback
    })}`
  });

  return text ? { ...fallback, ...parseJson(text, fallback) } : fallback;
};

export const generateSmartTasks = async (prompt = '') => {
  const normalized = prompt.trim() || 'Plan a project milestone';
  const base = normalized.replace(/^build\s+/i, '').replace(/^create\s+/i, '');
  const fallback = {
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

  const text = await callOpenAI({
    json: true,
    system: 'You are CollabSphere AI. Convert product requests into execution-ready task plans. Return only valid JSON.',
    user: `Create a task plan for: "${normalized}". Return JSON with title, estimatedTimeline, workflow array, subtasks array, risks array, acceptanceCriteria array.`
  });

  return text ? { ...fallback, ...parseJson(text, fallback) } : fallback;
};

export const generateMeetingNotes = async (text = '') => {
  const fallback = {
    summary: await summarizeText(text),
    decisions: splitText(text).slice(0, 2),
    actionItems: ['Confirm owners', 'Set due dates', 'Share async recap'],
    blockers: []
  };

  const aiText = await callOpenAI({
    json: true,
    system: 'You are CollabSphere AI. Turn meeting notes into structured project memory. Return only valid JSON.',
    user: `Return JSON with summary, decisions array, actionItems array, blockers array, followUpMessage. Notes:\n\n${text}`
  });

  return aiText ? { ...fallback, ...parseJson(aiText, fallback) } : fallback;
};

export const generateSmartReplies = async ({ thread = [], userName = 'teammate' }) => {
  const latest = thread.map(compactMessage).slice(-8);
  const fallback = [
    'Thanks, I will take this forward and share an update shortly.',
    'Good call. I will check the blocker and confirm the owner.',
    'I agree. Let us convert this into a task with a clear due date.'
  ];

  const text = await callOpenAI({
    json: true,
    system: 'You are CollabSphere AI. Suggest concise, professional team chat replies. Return only valid JSON.',
    user: `User name: ${userName}. Recent thread: ${JSON.stringify(latest)}. Return JSON with replies array of 3 short replies.`
  });

  const parsed = text ? parseJson(text, { replies: fallback }) : { replies: fallback };
  return parsed.replies || fallback;
};

export const generateAssistantResponse = async ({ question = '', tasks = [], activities = [], messages = [] }) => {
  const fallbackInsights = await generateInsights({ tasks, activities });
  const fallback = `Workspace brief: completion is ${fallbackInsights.completionRate}%, ${fallbackInsights.pending} tasks are still pending, and the next best move is to ${fallbackInsights.suggestions[0].toLowerCase()}`;

  const text = await callOpenAI({
    system: 'You are the embedded CollabSphere productivity assistant. Answer with product-manager clarity, using the workspace context. Keep it under 160 words unless asked otherwise.',
    user: `Question: ${question}\n\nContext: ${JSON.stringify({
      tasks: tasks.slice(0, 40).map(compactTask),
      activities: activities.slice(0, 25).map(compactActivity),
      messages: messages.slice(-12).map(compactMessage)
    })}`
  });

  return text || fallback;
};

export const generateCollaborationRecommendations = async ({ tasks = [], activities = [], members = [] }) => {
  const fallback = [
    'Create a daily async standup thread for blockers and launch risks.',
    'Assign review owners to tasks already above 70% progress.',
    'Move overdue tasks into a focused triage lane before adding new scope.'
  ];

  const text = await callOpenAI({
    json: true,
    system: 'You are CollabSphere AI. Recommend concrete collaboration improvements. Return only valid JSON.',
    user: `Return JSON with recommendations array of 3 objects {title, reason, impact}. Context: ${JSON.stringify({
      tasks: tasks.slice(0, 50).map(compactTask),
      activities: activities.slice(0, 30).map(compactActivity),
      members: members.map((member) => ({ role: member.role, name: member.user?.name }))
    })}`
  });

  const parsed = text ? parseJson(text, { recommendations: fallback.map((title) => ({ title, reason: 'Improves team execution clarity.', impact: 'medium' })) }) : null;
  return parsed?.recommendations || fallback.map((title) => ({ title, reason: 'Improves team execution clarity.', impact: 'medium' }));
};

export const runSlashCommand = async ({ command = '', context = {} }) => {
  const normalized = command.trim();
  if (normalized.startsWith('/summarize')) {
    return { type: 'summary', content: await summarizeText(context.text || context.latestMessages || normalized.replace('/summarize', '')) };
  }
  if (normalized.startsWith('/tasks')) {
    return { type: 'task_plan', content: await generateSmartTasks(normalized.replace('/tasks', '').trim()) };
  }
  if (normalized.startsWith('/standup')) {
    return {
      type: 'standup',
      content: await generateAssistantResponse({
        question: 'Create a short standup update from this workspace.',
        tasks: context.tasks || [],
        activities: context.activities || [],
        messages: context.messages || []
      })
    };
  }

  const content = await generateAssistantResponse({
    question: normalized.replace(/^\//, ''),
    tasks: context.tasks || [],
    activities: context.activities || [],
    messages: context.messages || []
  });
  return { type: 'assistant', content };
};
