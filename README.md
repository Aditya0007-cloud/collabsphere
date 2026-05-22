# CollabSphere - Real-Time Team Collaboration Platform

![CollabSphere banner](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80)

CollabSphere is a portfolio-grade MERN SaaS workspace inspired by Slack, Notion, Trello, Linear, and Discord. It combines realtime team chat, Kanban execution, file sharing, activity timelines, notifications, analytics dashboards, profile management, and AI productivity tools in one polished collaboration product.

## Tech Stack

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=111)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=fff)
![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=fff)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=fff)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=fff)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-f43f5e)

## Features

- JWT signup, login, logout, protected routes, bcrypt password hashing, persistent sessions
- Team workspaces with invite codes, members, roles, settings, and workspace themes
- Socket.IO realtime chat with group channels, typing events, presence, pinned-message support, mentions, and notifications
- Trello-style Kanban board with drag and drop, priorities, due dates, assignees, labels, comments-ready schema, progress tracking, and live task updates
- File hub for images, documents, previews, downloads, local uploads, and link sharing
- Activity timeline for task, message, file, join, and workspace events
- Realtime notifications for task assignments, mentions, files, deadlines, and system events
- User profile with avatar, bio, skills, activity stats, and team memberships
- AI summarizer, AI smart task generator, and productivity insights with no-key fallback logic
- Analytics dashboard with active users, task metrics, priority distribution, productivity charts, recent activity, and deadlines
- Dark/light mode, collapsible sidebar, mobile navigation, loading skeletons, glass UI, Framer Motion transitions, and responsive layouts

## Screenshots

Add screenshots after running locally:

- `screenshots/auth.png` - futuristic authentication and demo entry
- `screenshots/dashboard.png` - analytics dashboard with charts
- `screenshots/chat.png` - realtime channel with presence
- `screenshots/kanban.png` - Trello-style task board
- `screenshots/ai-studio.png` - AI summarizer and smart task planner

## Architecture

```txt
client/
  src/
    components/      Reusable product surfaces and widgets
    pages/           Auth and workspace experiences
    layouts/         App shell, sidebar, topbar
    context/         Auth/session state
    services/        Axios API and Socket.IO client
    utils/           Demo data and formatting helpers

server/
  config/            Environment and MongoDB connection
  controllers/       REST API business logic
  middleware/        Auth, validation, uploads, errors
  models/            Mongoose schemas
  routes/            Express route modules
  sockets/           Socket.IO realtime handlers
  services/          AI and activity services
  utils/             JWT, emitters, API errors, access helpers
  scripts/           Demo seed script
```

## API Overview

Base URL: `http://localhost:5001/api`

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` |
| Workspaces | `GET /workspaces`, `POST /workspaces`, `POST /workspaces/join`, `GET /workspaces/:id`, `PATCH /workspaces/:id` |
| Tasks | `GET /tasks/:workspaceId`, `POST /tasks/:workspaceId`, `PATCH /tasks/:workspaceId/:taskId`, `DELETE /tasks/:workspaceId/:taskId` |
| Messages | `GET /messages/:workspaceId`, `POST /messages/:workspaceId`, `PATCH /messages/:workspaceId/:messageId/pin` |
| Files | `GET /files/:workspaceId`, `POST /files/:workspaceId` |
| Notifications | `GET /notifications`, `PATCH /notifications/read-all`, `PATCH /notifications/:id/read` |
| Analytics | `GET /analytics/:workspaceId/dashboard` |
| AI | `POST /ai/summarize`, `POST /ai/smart-tasks`, `GET /ai/:workspaceId/insights` |

Socket events include `workspace:join`, `message:send`, `message:new`, `typing:start`, `typing:stop`, `presence:update`, `task:created`, `task:updated`, `file:new`, and `activity:new`.

## Local Setup

```bash
git clone <your-repo-url>
cd collaboration\ platform
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Start MongoDB locally, then update `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/collabsphere
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5188
CLIENT_ORIGINS=http://localhost:5188,https://your-vercel-app.vercel.app
```

Seed demo data:

```bash
npm run seed --prefix server
```

Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:5188`  
Backend: `http://localhost:5011/health`

Seeded login:

```txt
aditya@collabsphere.dev
Password123
```

The frontend also includes a portfolio demo mode that works without MongoDB.

## Deployment

### Frontend on Vercel

1. Import the repo in Vercel.
2. Set root directory to `client`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add environment variables:

```env
VITE_API_URL=https://your-render-api.onrender.com/api
VITE_SOCKET_URL=https://your-render-api.onrender.com
```

### Backend on Render or Railway

1. Create a Node web service with root directory `server`.
2. Build command: `npm install`.
3. Start command: `npm start`.
4. Add environment variables from `server/.env.example`.
5. Set `CLIENT_URL` to your Vercel domain.
6. Use MongoDB Atlas for `MONGO_URI`.

## Production Notes

- CORS is environment-driven through `CLIENT_URL`.
- JWT secret and Mongo URI are required in production.
- File uploads use local storage in development and automatically use Cloudinary in production when Cloudinary env keys are set.
- AI features include deterministic fallback responses; OpenAI/Gemini can be wired through `server/services/aiService.js`.
- `client/vercel.json`, `server/render.yaml`, and `server/Procfile` are included for deployment readiness.

## Future Roadmap

- Google OAuth and SSO
- Cloudinary upload adapter
- Video/audio meeting rooms with screen sharing
- Calendar integrations and deadline reminders
- Markdown editor with slash commands
- Workspace-level permissions and audit exports
- Dedicated mobile app shell

## LinkedIn-Ready Description

Built **CollabSphere**, a full-stack real-time team collaboration SaaS using React, Tailwind CSS, Framer Motion, Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, and Socket.IO. The platform includes authenticated workspaces, realtime chat, presence, Kanban task management, file sharing, activity timelines, notifications, AI-powered summaries and task planning, analytics dashboards, dark/light mode, responsive design, and deployment-ready configuration for Vercel and Render.
