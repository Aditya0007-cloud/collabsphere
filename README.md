# CollabSphere - Real-Time Team Collaboration Platform

![CollabSphere banner](https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80)

CollabSphere is a portfolio-grade MERN SaaS workspace inspired by Slack, Notion, Trello, Linear, Monday.com, and Discord. It combines a public SaaS landing page, authenticated workspaces, realtime chat, Kanban execution, file sharing, activity timelines, notifications, analytics dashboards, profile management, and AI productivity tools in one polished collaboration product.

## Tech Stack

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=111)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=fff)
![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=fff)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=fff)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=fff)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-f43f5e)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7)

## Features

- Public startup-style landing page with product preview, pricing, CTA, responsive nav, and dark mode
- JWT signup, login, logout, protected routes, bcrypt password hashing, strict email uniqueness, and persistent sessions
- Team workspaces with invite codes, members, role-ready schema, settings, and workspace switching
- Socket.IO realtime chat with group channels, typing events, presence, pinned-message support, mentions, and notifications
- Trello-style Kanban board with drag and drop, priorities, due dates, assignees, labels, comments, progress tracking, and live task updates
- File hub for images, documents, previews, downloads, Cloudinary-ready uploads, and link sharing
- Activity timeline for task, message, file, join, and workspace events
- AI summarizer, meeting notes, smart task generator, floating assistant, slash commands, smart replies, recommendations, and productivity insights with no-key fallback logic
- Analytics dashboard with active users, task metrics, priority distribution, productivity charts, recent activity, and deadlines
- Dark/light mode, collapsible sidebar, mobile navigation, loading skeletons, empty states, glass UI, Framer Motion transitions, and responsive layouts
- Backend hardening with Helmet, CORS controls, rate limiting, Morgan logging, centralized error handling, and Zod environment validation

## Architecture

```txt
client/
  src/
    components/      Reusable product surfaces and widgets
    pages/           Landing, auth, and workspace experiences
    layouts/         App shell, sidebar, topbar
    context/         Auth/session state
    services/        Axios API and Socket.IO client
    utils/           Demo data and formatting helpers

server/
  config/            Environment validation, MongoDB, Cloudinary
  controllers/       REST API business logic
  middleware/        Auth, validation, uploads, errors
  models/            Mongoose schemas
  routes/            Express route modules
  sockets/           Socket.IO realtime handlers
  services/          AI and activity services
  utils/             JWT, emitters, API errors, access helpers
  scripts/           Demo seed script
```

See [Architecture Notes](docs/ARCHITECTURE.md) for a deeper system overview.

## API Overview

Base URL: `http://localhost:5011/api`

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/signup`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`, `POST /auth/logout`, `POST /auth/logout-all` |
| Workspaces | `GET /workspaces`, `POST /workspaces`, `POST /workspaces/join`, `GET /workspaces/:id`, `PATCH /workspaces/:id` |
| Tasks | `GET /tasks/:workspaceId`, `POST /tasks/:workspaceId`, `PATCH /tasks/:workspaceId/:taskId`, `DELETE /tasks/:workspaceId/:taskId` |
| Messages | `GET /messages/:workspaceId`, `POST /messages/:workspaceId`, `PATCH /messages/:workspaceId/:messageId/pin` |
| Files | `GET /files/:workspaceId`, `POST /files/:workspaceId` |
| Notifications | `GET /notifications`, `PATCH /notifications/read-all`, `PATCH /notifications/:id/read` |
| Analytics | `GET /analytics/:workspaceId/dashboard` |
| AI | `POST /ai/summarize`, `POST /ai/smart-tasks`, `POST /ai/meeting-notes`, `POST /ai/smart-replies`, `POST /ai/slash-command`, `GET /ai/:workspaceId/insights`, `GET /ai/:workspaceId/recommendations`, `POST /ai/:workspaceId/assistant` |

Socket events include `workspace:join`, `message:send`, `message:new`, `typing:start`, `typing:stop`, `presence:update`, `task:created`, `task:updated`, `file:new`, and `activity:new`.

## Local Setup

```bash
git clone https://github.com/aditya0007-cloud/collabsphere.git
cd collabsphere
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Use MongoDB Atlas or local MongoDB, then update `server/.env`:

```env
PORT=5011
NODE_ENV=development
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/collabsphere?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5188
CLIENT_ORIGINS=http://localhost:5188
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
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

## Render Deployment

### Backend Web Service

Name: `collabsphere-api`  
Root directory: `server`  
Build command: `npm install`  
Start command: `npm start`  
Health check path: `/health`

Environment variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/collabsphere?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=replace-with-a-long-random-production-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-render-frontend.onrender.com
CLIENT_ORIGINS=https://your-render-frontend.onrender.com
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### Frontend Static Site

Name: `collabsphere-web`  
Root directory: `client`  
Build command: `npm install && npm run build`  
Publish directory: `dist`

Environment variables:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
VITE_SOCKET_URL=https://your-render-backend.onrender.com
```

## Screenshots

Add screenshots after deploying:

- `screenshots/landing.png` - public SaaS homepage
- `screenshots/auth.png` - login/signup flow
- `screenshots/dashboard.png` - analytics dashboard
- `screenshots/chat.png` - realtime channel with presence
- `screenshots/kanban.png` - task board
- `screenshots/ai-studio.png` - AI summarizer and smart planner

## Production Notes

- CORS is environment-driven through `CLIENT_URL` and `CLIENT_ORIGINS`.
- JWT secret and Mongo URI are required in production.
- Environment variables are validated with Zod on backend startup.
- File uploads use local storage in development and Cloudinary in production when Cloudinary env keys are set.
- AI features use OpenAI when `OPENAI_API_KEY` is configured and automatically fall back to deterministic workspace-aware responses when it is not.
- `client/vercel.json`, `server/render.yaml`, and `server/Procfile` are included for deployment readiness.

## Future Roadmap

- Collaborative whiteboard and live cursors
- Google OAuth and SSO
- dnd-kit sortable Kanban columns
- Video/audio meeting rooms with screen sharing
- Calendar integrations and deadline reminders
- Markdown editor with slash commands
- Workspace-level permissions and audit exports
- Dedicated mobile app shell

## LinkedIn-Ready Description

Built **CollabSphere**, a full-stack real-time team collaboration SaaS using React, Tailwind CSS, Framer Motion, Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, Socket.IO, Recharts, Cloudinary-ready uploads, and Render. The platform includes a startup-style landing page, authenticated workspaces, realtime chat, presence, Kanban task management, file sharing, activity timelines, notifications, AI-powered summaries and task planning, analytics dashboards, dark/light mode, responsive design, and production deployment configuration.

See [LinkedIn Showcase Kit](docs/LINKEDIN_SHOWCASE.md) for project descriptions and resume bullets.
