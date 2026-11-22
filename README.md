# MOCHILA Educational Web App

## Project Overview

MOCHILA is a full-stack educational web application designed to help students learn more effectively using AI-powered study tools, note management, and progress tracking.

It consists of:

- A backend API built with **Node.js**, **Express**, and **MongoDB**.
- A frontend application built with **React**, **TypeScript**, **Vite**, and modern UI tooling.
- AI-powered features integrated with **OpenAI** for topic explanations, quiz generation, and note summarization.

## Key Features

### Core Student Features

- User registration and login with **JWT authentication**.
- Personal topic management: create, view, update, and delete study topics.
- Notes library for saving and organizing AI-generated or manual study notes.
- Search notes by topic or content.
- Study logs to track time spent, scores, and learning progress.
- Progress tracker showing study statistics and weak topics.

### AI Learning Tools

- **Ask Mochila**: AI tutor for explaining topics in a beginner-friendly way.
- **Quiz Generator**: Generate quick quizzes based on a study topic.
- **Summarize Notes**: Turn long note content into concise key points.

### Admin Features

- Admin dashboard with system and usage statistics.
- User list management.
- Topic administration across all users.
- Admin-only API routes protected by role-based authorization.

## Project Structure

```
backend/
  package.json
  server.js
  config/
    database.js
  controllers/
    aiController.js
    authController.js
    logController.js
    noteController.js
    topicController.js
  middleware/
    authMiddleware.js
  models/
    Note.js
    StudyLog.js
    Topic.js
    User.js
  routes/
    aiRoutes.js
    authRoutes.js
    logRoutes.js
    noteRoutes.js
    topicRoutes.js
    userRoutes.js

MOCHILA Educational Web App UI/
  package.json
  vite.config.ts
  src/
    app/
      App.tsx
      routes.tsx
      components/
      contexts/
      pages/
      services/api.ts
      styles/
```

## Backend Architecture

### Server

- `backend/server.js`: app entry point.
- Configures Express middleware, CORS, JSON parsing, and route mounting.
- Connects to MongoDB using `config/database.js`.

### Authentication

- JWT-based auth with `authMiddleware.js`.
- `protect` middleware enforces authenticated access.
- `isAdmin` middleware restricts admin routes.
- First registered account becomes `admin` by default.

### Data Models

- `User`: username, email, password, role.
- `Topic`: user-owned study topics with title, description, progress.
- `Note`: user notes linked to topics.
- `StudyLog`: study sessions with time, score, and date.

### Routes and Controllers

- `authRoutes.js`: registration and login.
- `topicRoutes.js`: create, read, update, delete topics.
- `noteRoutes.js`: create, read, update, delete notes.
- `logRoutes.js`: record study sessions and fetch summaries.
- `aiRoutes.js`: explain topic, generate quiz, summarize notes.
- `userRoutes.js`: profile endpoint and admin dashboard/users/topics.

### AI Integration

- `backend/controllers/aiController.js` uses OpenAI's `gpt-4o-mini`.
- Provides fallback mock responses when the OpenAI quota is exceeded.

## Frontend Architecture

### Routing

- `src/app/routes.tsx` defines protected and public routes.
- Uses React Router v7 with nested routes.
- Public pages: Login, Register.
- Protected pages: Dashboard, AskMochila, QuizGenerator, Flashcards, ExamMode, NotesLibrary, ProgressTracker.
- Admin pages: AdminDashboard, Users, Topics, Analytics.

### State and Auth

- `src/app/contexts/AuthContext.tsx` manages login state, token storage, and user state.
- Stores `mochila_token` and `mochila_user` in localStorage.

### API Layer

- `src/app/services/api.ts` configures Axios with auth headers.
- Exposes API clients for auth, admin, topics, notes, logs, and AI.

## API Reference

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user/profile`

### Topics

- `POST /api/topics`
- `GET /api/topics`
- `GET /api/topics/:id`
- `PUT /api/topics/:id`
- `DELETE /api/topics/:id`

### Notes

- `POST /api/notes`
- `GET /api/notes`
- `GET /api/notes/topic/:topicId`
- `GET /api/notes/:id`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

### Study Logs

- `POST /api/logs`
- `GET /api/logs/topic/:topicId`
- `GET /api/logs/summary`

### AI Tools

- `POST /api/ai/explain`
- `POST /api/ai/quiz`
- `POST /api/ai/summarize`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/topics`
- `DELETE /api/admin/topics/:id`

## Setup and Running

### Backend

1. Open a terminal in `backend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```env
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   OPENAI_API_KEY=<your_openai_api_key>
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal in `MOCHILA Educational Web App UI/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm run dev
   ```
4. The app will typically run at `http://localhost:5173`.

## Notes and Recommendations

- The first registered user is assigned the `admin` role automatically.
- Protect your `JWT_SECRET` and `OPENAI_API_KEY` in environment variables.
- The frontend uses `VITE_API_BASE_URL` if provided, otherwise defaults to `http://localhost:5000`.
- Consider adding end-to-end tests and validation for complete production readiness.

## Suggested Improvements

- Add pagination for notes and topics.
- Improve frontend error handling and user feedback.
- Add delete/update UI controls for notes and topics.
- Support image-rich notes or attachments.
- Add more AI-driven study modes like spaced repetition or flashcard auto-generation.
