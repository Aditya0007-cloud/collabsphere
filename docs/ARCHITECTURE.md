# CollabSphere Architecture

## System Overview

```txt
Browser
  |
  | React + Tailwind + Socket.IO client
  v
Render Static Site
  |
  | HTTPS REST + WebSocket
  v
Render Node Web Service
  |
  | Express routes, controllers, middleware
  v
MongoDB Atlas
```

## Frontend

- `LandingPage` presents a public SaaS homepage for recruiters and demo visitors.
- `AuthPage` handles signup/login and routes authenticated users into `/app`.
- `WorkspacePage` coordinates dashboard, chat, tasks, files, activity, AI, and settings.
- `AppShell` owns sidebar, topbar, mobile navigation, theme toggle, and product layout.

## Backend

- `app.js` configures security headers, CORS, JSON parsing, logging, rate limiting, and routes.
- `server.js` creates the HTTP server, connects MongoDB, and registers Socket.IO handlers.
- `models/` stores normalized Mongoose schemas for users, workspaces, tasks, messages, files, notifications, and activity.
- `controllers/` keeps API behavior modular by feature.
- `services/` isolates reusable activity and AI logic.
- `middleware/` handles auth, validation, upload handling, and centralized errors.

## Realtime Flow

Socket.IO authenticates users with JWT, joins workspace rooms, broadcasts message/task/file/activity changes, and emits presence plus typing updates.

## Deployment

- Frontend: Render Static Site from `client`.
- Backend: Render Web Service from `server`.
- Database: MongoDB Atlas.
- File storage: Cloudinary when configured, local upload fallback in development.
