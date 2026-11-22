# MOCHILA UI Review

Review of the React frontend in `MOCHILA Educational Web App UI`. This is a source review of every screen, the shared shell, and how each control is wired.

## Visual system

The student app uses a navy sidebar (`#1E2A44`), blue (`#4A90E2`), purple (`#7C5CFF`), and mint (`#2ED3B7`) on a light gray page (`#F7F9FC`). Cards are white, corners are large (`rounded-2xl` / `rounded-3xl`), and primary actions use a blue-to-purple gradient.

Theme tokens live in `src/styles/theme.css`. The sidebar theme switcher offers four modes: Light, Dark, Game Mode, and Flower Mode. Login, Register, Ask MOCHILA, Quiz, Flashcards, Exam Mode, Notes, and the admin console still paint backgrounds, text, and borders with fixed light colors (`bg-white`, `#1C1F2A`, `bg-gray-100`). Those screens stay light when another theme is selected. Dashboard, the navbar, and the sidebar follow the tokens.

Icons come from `lucide-react`. Shared form and chart pieces exist under `src/app/components/ui`, and Progress Tracker is the main page that uses them.

## App shell

`Layout` is a fixed sidebar, a fixed top bar, and a main area offset by `pt-16` and `md:ml-64`.

**Sidebar** (`Sidebar.tsx`), desktop only (`hidden md:flex`):

| Label | Path |
| --- | --- |
| Dashboard | `/` |
| Ask MOCHILA | `/ask-mochila` |
| Quiz Generator | `/quiz` |
| Flashcards | `/flashcards` |
| Exam Mode | `/exam` |
| Notes Library | `/notes` |
| Progress Tracker | `/progress` |

The active item uses the sidebar primary color. The footer has the theme switcher and a **View Tutorial** button with no click handler. There is no mobile menu, so below the `md` breakpoint the navigation disappears and the page has no way to change screens except the dashboard quick actions.

**Navbar** (`Navbar.tsx`):

- Search field labeled “Search for topics, notes, or quizzes…” has no state and does not filter anything.
- The bell shows a red dot and has no click handler.
- The right side shows `username` and `role`. The round button logs the user out and sends them to `/login`.

## Auth screens

**Login** (`/login`) and **Register** (`/register`) are centered cards on `bg-slate-50`. Both show a rose error banner, disable the button while the request runs, and link to each other.

Register collects username, email, and password, then logs the new account in and opens `/`.

The route guard in `ProtectedRoute.tsx` is commented out, so `/`, the study pages, and `/admin` open without a session. `AuthContext` also starts with a stored user or a built-in guest:

- username: Guest User
- email: guest@example.com
- role: admin
- token: `mock-token` when nothing is stored

Logout clears storage, then the next load creates that guest again. The navbar can therefore say “Guest User” and “admin Member” before anyone signs in, and the admin area is reachable from that guest.

## Student screens

### Dashboard (`/`)

Loads `GET` study summary on mount. Greeting uses the signed-in username.

Three stat cards: study sessions, average score, tracked topics. “Continue Learning” lists the first two topics with a score bar, or a dashed empty state. Those rows are not links. Quick actions go to Ask MOCHILA, Quiz, Flashcards, and Exam Mode. “Weak Areas” and “Recent Activity” render the summary or an empty state. Failed loads only log to the console, so a down API still looks like an empty dashboard.

### Ask MOCHILA (`/ask-mochila`)

Three columns: conversation list, chat, generated notes.

- Sending a message calls `POST /api/ai/explain` and appends the reply.
- Enter sends. The button label switches to “Thinking…”.
- A failed request shows “Sorry, I couldn't reach MOCHILA right now.”
- History is kept in component state. Refreshing the page clears it. Conversation buttons in the left list do not reopen a thread.
- The right panel splits the latest reply into lines and can save it through `POST /api/notes` after a topic is chosen. Success and failure use `alert()`.

The three columns are fixed at `w-80` plus a flexible center. On a narrow screen they stay in one row and overflow.

### Quiz Generator (`/quiz`)

A single topic field and **Generate Quiz** call `POST /api/ai/quiz`. The result is shown as plain text (`whitespace-pre-line`). There are no answer choices, scoring, or a way to save the quiz. Empty input shows “Please enter a topic or concept to generate a quiz.”

### Flashcards (`/flashcards`)

Fully local. Three sample sets (Calculus Derivatives, Organic Chemistry, World History) and four hardcoded cards. The study view flips a card, marks it known or still learning, and moves next or previous. Progress resets in memory only. Sets are not loaded from topics or the AI API.

### Exam Mode (`/exam`)

A local eight-question calculus exam: start screen, countdown from 45:00, flag, option select, question grid, and a results screen with score and per-question review. Answers are the mock array in the file. The exam is not generated from a topic and the score is not written to study logs.

### Notes Library (`/notes`)

Loads notes and topics from the API. Search filters the current list by topic title or content. **New Note** opens a topic select and a textarea, then `POST /api/notes`. Cards show a preview and the created date.

Edit, download, and delete icons appear on hover and have no handlers. There is no summarize action on this page, even though the backend has `POST /api/ai/summarize`.

### Progress Tracker (`/progress`)

The page that is closest to a finished data screen. It loads the summary and the user’s topics, shows totals, a bar chart, weak topics, and recent sessions, and posts a new log (topic, minutes, score). Errors use a toast. Empty and loading states are present.

## Admin screens

`/admin` uses `AdminLayout`, a separate light sidebar (Dashboard, Users, Topics, Analytics). It redirects to `/` only when `user.role` is not `admin`. The guest user is created with `role: "admin"`, so this check does not block the preview account.

| Screen | What the UI does |
| --- | --- |
| Admin Dashboard | Four metric cards from `GET /api/admin/dashboard`: users, active users, topics, study logs. Shows an error banner if the request fails. |
| Users | Read-only table: username, email, role, joined date. Loading and empty rows are handled. No edit or delete. |
| Topics | Table of every topic, plus create and delete. Delete calls the admin API and removes the row. |
| Analytics | Three cards (active users, total topics, system activity) from the same dashboard endpoint. A failed load leaves the cards at zero with no error message. |

Admin pages do not use the student theme switcher.

## What is connected, and what is still a preview

| Screen | Data |
| --- | --- |
| Login, Register | Real auth API |
| Dashboard, Progress | Real study-log summary |
| Ask MOCHILA, Quiz | Real OpenAI routes, with the backend mock fallback when quota is exceeded |
| Notes create and list | Real notes API |
| Admin users, topics, stats | Real admin API |
| Flashcards, Exam Mode | Hardcoded sample content |
| Navbar search, bell, View Tutorial | Visual only |
| Note edit, download, delete | Icons only |
| Ask MOCHILA history | Lost on refresh |

## Issues to fix next

1. Turn the route guard back on, and stop seeding a guest admin and `mock-token` when storage is empty.
2. Add a mobile navigation drawer. The sidebar is `hidden` under `md`, and Ask MOCHILA’s three columns do not wrap.
3. Point Quiz, Flashcards, Notes, Exam, Login, and Admin at the theme tokens so Dark, Game, and Flower change those pages too.
4. Wire navbar search to notes and topics, or remove it until it does.
5. Give note cards real edit and delete actions. The API already supports both.
6. Replace Flashcards and Exam Mode sample data with topic-based content, and save exam scores into study logs so the dashboard reflects them.
7. Persist Ask MOCHILA threads, and make a history item reopen that thread.
8. Surface API failures on the dashboard and Analytics the same way Notes and Admin Dashboard already do.
