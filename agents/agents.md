# SoloLev Codebase Structure

> A streak-based leveling app built with Expo (React Native) + Express + MongoDB

## Project Overview

**Concept:**

- Complete all daily tasks → streak continues
- Every 7 days of streak = 1 level up
- Break the streak → back to level 1

**Tech Stack:**

- **Mobile App:** Expo (React Native) + TypeScript
- **Backend API:** Express + TypeScript + MongoDB
- **Auth:** Google OAuth 2.0 with JWT sessions

---

## Directory Structure

```
sololev/
├── app/                    # Expo Router screens (file-based routing)
│   ├── _layout.tsx         # Root layout with navigation
│   ├── modal.tsx           # Modal screen
│   └── (tabs)/             # Tab navigation group
│       ├── _layout.tsx     # Tab bar configuration
│       ├── index.tsx       # Home screen
│       └── explore.tsx     # Explore screen
│
├── api/                    # Express backend server
│   └── src/
│       ├── index.ts        # Server entry point
│       ├── config/
│       │   ├── database.ts     # MongoDB connection
│       │   └── passport.ts     # Google OAuth config
│       ├── middleware/
│       │   └── auth.ts         # JWT auth middleware
│       ├── models/
│       │   ├── index.ts        # Model exports
│       │   ├── User.ts         # User schema (streak, level data)
│       │   ├── Task.ts         # Task schema (daily todos)
│       │   └── Session.ts      # JWT session storage
│       ├── routes/
│       │   ├── auth.ts         # OAuth & session routes
│       │   ├── tasks.ts        # CRUD for tasks
│       │   └── users.ts        # User profile & progress
│       ├── types/
│       │   ├── user.ts         # User interfaces + level calc
│       │   └── task.ts         # Task interfaces
│       └── utils/
│           └── env-check.service.ts
│
├── agents/                 # AI agent specifications
│   ├── agents.md           # This file
│   └── component/
│       └── folder.specification.md  # Component creation guide
│
├── assets/
│   └── images/             # App images & icons
│
├── components/             # Reusable UI components
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
│   └── ui/
│       ├── collapsible.tsx
│       ├── icon-symbol.tsx
│       └── icon-symbol.ios.tsx
│
├── constants/
│   └── theme.ts            # Solo Leveling color palette & theming
│
├── hooks/                  # Custom React hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── scripts/
│   └── reset-project.js    # Reset to fresh state
│
├── server/                 # Mobile app API services (client-side)
│   ├── auth.ts             # Auth API calls (empty - TODO)
│   ├── axios.instance.ts   # Axios config (empty - TODO)
│   ├── session.ts          # Session management (empty - TODO)
│   └── task.ts             # Task API calls (empty - TODO)
│
├── app.json                # Expo config
├── package.json            # Root dependencies (Expo)
├── tsconfig.json           # TypeScript config
├── eslint.config.js        # ESLint config
├── README.md               # Quick start guide
└── development.md          # Development guide
```

---

## Key Files & Their Purpose

### Mobile App (Expo)

| File                        | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `app/_layout.tsx`           | Root layout, theme provider, navigation stack   |
| `app/(tabs)/_layout.tsx`    | Tab bar with Home & Explore tabs                |
| `constants/theme.ts`        | Solo Leveling color palette (purple/blue tones) |
| `components/themed-*.tsx`   | Theme-aware Text/View components                |
| `hooks/use-color-scheme.ts` | Dark/light mode detection                       |

### Backend API (Express)

| File                         | Purpose                                  |
| ---------------------------- | ---------------------------------------- |
| `api/src/index.ts`           | Express server setup, CORS, routes       |
| `api/src/config/passport.ts` | Google OAuth strategy                    |
| `api/src/middleware/auth.ts` | JWT token verification                   |
| `api/src/models/User.ts`     | User with streak/level tracking          |
| `api/src/models/Task.ts`     | Daily tasks with userId & date           |
| `api/src/types/user.ts`      | `calculateLevel()` & `daysToNextLevel()` |

---

## Data Models

### User

```typescript
interface IUser {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  currentStreak: number; // Days in current streak
  longestStreak: number; // Personal best
  lastCompletedDate: Date; // For streak continuation
  createdAt: Date;
  updatedAt: Date;
}
```

### Task

```typescript
interface ITask {
  userId: ObjectId;
  title: string;
  completed: boolean;
  date: string; // YYYY-MM-DD format
  createdAt: Date;
  updatedAt: Date;
}
```

### Session

```typescript
interface ISession {
  userId: ObjectId;
  token: string; // JWT token
  expiresAt: Date; // Auto-deleted on expiry
  createdAt: Date;
}
```

---

## API Endpoints

### Auth

| Method | Endpoint                    | Description                 |
| ------ | --------------------------- | --------------------------- |
| GET    | `/api/auth/google`          | Redirect to Google OAuth    |
| GET    | `/api/auth/google/callback` | OAuth callback, returns JWT |
| GET    | `/api/auth/verify`          | Verify token validity       |
| POST   | `/api/auth/logout`          | Invalidate session          |

### Tasks (Protected)

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| GET    | `/api/tasks`         | Get all tasks (?date=YYYY-MM-DD) |
| GET    | `/api/tasks/today`   | Get today's tasks                |
| POST   | `/api/tasks`         | Create task                      |
| PATCH  | `/api/tasks/:taskId` | Update task                      |
| DELETE | `/api/tasks/:taskId` | Delete task                      |

### Users (Protected)

| Method | Endpoint                     | Description                 |
| ------ | ---------------------------- | --------------------------- |
| GET    | `/api/users/me`              | Get current user            |
| GET    | `/api/users/me/progress`     | Get level, streak, stats    |
| POST   | `/api/users/me/complete-day` | Complete day, update streak |

---

## Level System

```typescript
// Every 7 streak days = 1 level
function calculateLevel(streakDays: number): number {
  if (streakDays <= 0) return 1;
  return Math.floor((streakDays - 1) / 7) + 1;
}

function daysToNextLevel(streakDays: number): number {
  const currentLevel = calculateLevel(streakDays);
  const daysForNextLevel = currentLevel * 7;
  return daysForNextLevel - streakDays + 1;
}
```

---

## Component Creation Guidelines

Follow `agents/component/folder.specification.md`:

```
components/
  ComponentName/
    index.ts              # Exports
    ComponentName.styles.ts    # Styles (using SoloLevelingPalette)
    ComponentName.component.tsx # Component logic & JSX
    ComponentName.types.ts      # Types (optional)
```

---

## Theme (Solo Leveling Palette)

```typescript
const SoloLevelingPalette = {
  // Primary - Deep purple/violet
  primary: "#A480F2",

  // Secondary - Electric blue
  secondary: "#445EF2",

  // Backgrounds - Dark mysterious tones
  backgroundDark: "#221426", // Main background
  backgroundMid: "#1D1340", // Cards, modals
  backgroundLight: "#2D1F4A", // Elevated surfaces

  // Status
  success: "#22C55E", // Quest complete
  warning: "#F59E0B", // Streak warning
  danger: "#EF4444", // Streak lost
};
```

---

## TODO Items

The following files in `/server/` are stubs awaiting implementation:

- `server/auth.ts` - Client-side auth service
- `server/axios.instance.ts` - Axios instance with auth headers
- `server/session.ts` - Session storage on device
- `server/task.ts` - Task API service calls

---

## Running the Project

### Mobile App

```bash
npm install
npx expo start
```

### API Server

```bash
cd api
npm install
cp .env.example .env  # Configure environment
npm run dev
```
