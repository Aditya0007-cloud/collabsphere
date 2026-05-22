# CollabSphere - Real-Time Team Collaboration SaaS

![CollabSphere banner](client/public/og-preview.svg)

CollabSphere is a polished MERN collaboration platform inspired by Linear, Notion, Slack, Trello, Discord, and Vercel dashboards. It brings realtime team chat, workspaces, Kanban execution, file sharing, activity tracking, analytics, notifications, and AI productivity workflows into one startup-style SaaS product.

**Live Demo:** https://collabsphere-1-mqsy.onrender.com

**GitHub:** https://github.com/aditya0007-cloud/collabsphere

## Why This Project Stands Out

- Built as a production-style SaaS, not a beginner CRUD app
- Realtime collaboration powered by Socket.IO
- JWT authentication with refresh-token cookie support
- Workspace-based architecture with invite codes and role-ready models
- AI assistant, summaries, smart task generation, meeting notes, smart replies, and slash commands
- Recruiter-ready UI polish: landing page, command palette, onboarding hints, dark mode, responsive shell, skeletons, empty states, and social preview metadata
- Render-ready deployment for frontend and backend

## Tech Stack

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=111)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=fff)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-111827?logo=framer&logoColor=fff)
![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=fff)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=fff)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=fff)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-f43f5e)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7)

## Core Features

- **SaaS Landing Page:** hero, product preview, feature sections, pricing mockup, CTA, footer, SEO, OpenGraph, responsive navigation
- **Authentication:** signup, login, logout, protected routes, strict email uniqueness, bcrypt hashing, JWT access token, refresh cookie flow
- **Workspaces:** create workspace, join by invite code, switch workspaces, member roles, workspace settings
- **Realtime Chat:** group chat, typing indicators, presence-ready UI, pinned messages, mentions-ready schema, smart replies, slash commands
- **Kanban Board:** Todo, In Progress, Review, Completed, priorities, due dates, labels, assignees, comments, progress tracking
- **File Hub:** uploads, previews, downloads, Cloudinary-ready configuration
- **Activity Timeline:** task, message, file, member, and workspace events
- **Notifications:** unread badge, dropdown center, mark as read, live update-ready architecture
- **AI Productivity:** summarizer, meeting notes, smart task planner, floating AI assistant, recommendations, smart replies, OpenAI support with fallback logic
- **Analytics Dashboard:** active users, completed/pending tasks, task distribution, priority load, productivity charts, deadlines, focus heatmap
- **Premium UX:** command palette, keyboard shortcuts, onboarding walkthrough, skeleton loaders, polished empty states, dark/light mode, mobile bottom navigation, smooth transitions

## Demo Experience

The app includes a one-click portfolio demo from the auth page.

Seeded login for database demo:

```txt
Email: aditya@collabsphere.dev
Password: Password123
```

You can also launch the frontend-only demo workspace from the login page without creating an account.

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Cmd/Ctrl + K` | Open command palette |
| `Alt + 1` | Dashboard |
| `Alt + 2` | Chat |
| `Alt + 3` | Tasks |
| `Alt + 4` | Files |
| `Alt + 5` | Activity |
| `Alt + 6` | AI Studio |
| `?` | Toggle AI assistant |

## Architecture

```txt
client/
  src/
    components/      Reusable product widgets and SaaS surfaces
    pages/           Landing, auth, workspace app
    layouts/         Dashboard shell, sidebar, topbar, mobile nav
    context/         Auth/session state
    services/        Axios API and Socket.IO clients
    utils/           Demo data and formatting helpers
  public/
    favicon.svg
    og-preview.svg

server/
  config/            Environment validation, MongoDB, Cloudinary
  controllers/       Request handlers and business orchestration
  middleware/        Auth, roles, validation, uploads, errors
  models/            Mongoose schemas
  routes/            REST route modules
  sockets/           Socket.IO realtime handlers
  services/          AI and activity services
  utils/             JWT, emitters, API errors, workspace access
  scripts/           Demo seed script
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a deeper overview.

## API Overview

Base URL locally: `http://localhost:5011/api`

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

Socket events include `workspace:join`, `message:new`, `typing:start`, `typing:stop`, `presence:update`, `task:created`, `task:updated`, `task:deleted`, `file:new`, and `activity:new`.

## Local Setup

```bash
git clone https://github.com/aditya0007-cloud/collabsphere.git
cd collabsphere
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Update `server/.env`:

```env
PORT=5011
NODE_ENV=development
CLIENT_URL=http://localhost:5188
CLIENT_ORIGINS=http://localhost:5188
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/collabsphere?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Update `client/.env`:

```env
VITE_API_URL=http://localhost:5011/api
VITE_SOCKET_URL=http://localhost:5011
```

Seed realistic demo data:

```bash
npm run seed --prefix server
```

Run locally:

```bash
npm run dev
```

Frontend: `http://localhost:5188`

Backend health: `http://localhost:5011/health`

## Render Deployment

### Backend Web Service

Name: `collabsphere-api`

Root directory: `server`

Build command: `npm install`

Start command: `npm start`

Health check path: `/health`

Backend environment variables:

```env
NODE_ENV=production
CLIENT_URL=https://your-render-frontend.onrender.com
CLIENT_ORIGINS=https://your-render-frontend.onrender.com
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/collabsphere?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=replace-with-a-long-random-production-secret
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend Static Site

Name: `collabsphere-web`

Root directory: `client`

Build command: `npm install && npm run build`

Publish directory: `dist`

Frontend environment variables:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
VITE_SOCKET_URL=https://your-render-backend.onrender.com
```

## Screenshots To Add

Create a `screenshots/` folder and add:

- `landing.png` - SaaS landing page hero
- `auth-demo.png` - auth page with demo account section
- `dashboard.png` - analytics dashboard and focus heatmap
- `chat.png` - realtime chat with AI smart reply
- `kanban.png` - task board
- `ai-assistant.png` - floating AI assistant
- `command-palette.png` - Cmd/Ctrl+K command palette

## Production Notes

- Backend startup validates environment variables with Zod.
- CORS is controlled through `CLIENT_URL` and `CLIENT_ORIGINS`.
- Auth supports access tokens and secure HTTP-only refresh cookies.
- File uploads work locally and are Cloudinary-ready for production.
- AI features use OpenAI when `OPENAI_API_KEY` exists and fall back to deterministic workspace-aware responses when no key is configured.
- SEO, OpenGraph, favicon, social preview, and branded title are included.
- Route-level lazy loading improves frontend bundle splitting.

## Recruiter Talking Points

- Designed a full SaaS product experience with landing, auth, workspace shell, realtime chat, Kanban, files, notifications, analytics, and AI workflows.
- Built modular Express/Mongoose APIs with protected routes, centralized errors, validation, security middleware, and deployment-ready configuration.
- Integrated Socket.IO for realtime collaboration patterns including typing indicators, live task updates, activity streams, and notifications.
- Added AI productivity features that are embedded into workflow surfaces instead of isolated as a generic chatbot.
- Polished the frontend for portfolio review with responsive layouts, dark mode, skeletons, empty states, command palette, onboarding hints, and social preview metadata.

## Future Roadmap

- Collaborative whiteboard and live cursors
- dnd-kit sortable Kanban columns
- Google OAuth and SSO
- Workspace audit logs and export tools
- Webhook and API token system
- Calendar integration and deadline reminders
- Video/audio meeting rooms
- Advanced permissions and organization settings

## LinkedIn-Ready Description

Built **CollabSphere**, a real-time team collaboration SaaS using React, Tailwind CSS, Framer Motion, Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, Socket.IO, Recharts, OpenAI-ready AI workflows, Cloudinary-ready uploads, and Render. The platform includes a polished SaaS landing page, authenticated workspaces, realtime chat, Kanban task management, file sharing, notifications, activity timelines, AI summaries, smart task planning, analytics dashboards, command palette, onboarding UX, dark/light mode, responsive design, and production deployment configuration.

See [docs/LINKEDIN_SHOWCASE.md](docs/LINKEDIN_SHOWCASE.md) for resume bullets and showcase copy.
