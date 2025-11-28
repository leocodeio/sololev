# SoloLev 🎮⚔️

> _"I alone level up."_ — Inspired by Solo Leveling

A gamified task management app where completing daily tasks builds your streak and levels you up. Miss a day? Face the consequences. Delete tasks mid-streak? There's a penalty for that too.

---

## 🎯 Core Concept

Transform your daily productivity into an RPG-style progression system:

| Action                           | Result                               |
| -------------------------------- | ------------------------------------ |
| ✅ Complete ALL daily tasks      | Streak continues (+1 day)            |
| 🔥 7-day streak                  | Level UP!                            |
| ❌ Miss a day (incomplete tasks) | Streak resets to 0, Level drops to 1 |
| 🗑️ Delete tasks mid-day          | Penalty points reduce XP             |

---

## 🎮 Game Mechanics

### Level System

```
Level = floor((streak_days - 1) / 7) + 1

Day 1-7   → Level 1
Day 8-14  → Level 2
Day 15-21 → Level 3
...and so on
```

### XP & Completion Score

Each day you earn **XP** based on task completion:

```
Daily XP = (completed_tasks / total_tasks) × 100

Perfect Day (100%) = Full XP + Streak bonus
Partial Day (<100%) = Reduced XP, Streak BROKEN
```

### Task Deletion Penalty Algorithm 🧮

To prevent gaming the system by deleting incomplete tasks, we track **Task Integrity**:

```typescript
// Task states
type TaskState = "active" | "completed" | "deleted" | "hidden";

// Daily Score Calculation
interface DailyScore {
  totalCreated: number; // All tasks created today
  completed: number; // Tasks marked complete
  deleted: number; // Tasks deleted (counts against you)
  hidden: number; // Tasks hidden (doesn't count for/against)

  // Score formula
  completionRate: number; // completed / (totalCreated - hidden)
  penaltyRate: number; // deleted / totalCreated
  finalScore: number; // completionRate × (1 - penaltyRate × 0.5)
}

// Example:
// Created: 10 tasks
// Completed: 7
// Deleted: 2 (trying to cheat!)
// Hidden: 1

// completionRate = 7 / (10 - 1) = 7/9 = 77.8%
// penaltyRate = 2 / 10 = 20%
// finalScore = 77.8% × (1 - 0.20 × 0.5) = 77.8% × 0.9 = 70%

// Result: NOT a perfect day, streak broken!
```

### Streak Rules

| Scenario                        | Outcome                      |
| ------------------------------- | ---------------------------- |
| 100% completion, 0 deletions    | ✅ Streak +1                 |
| 100% completion, some deletions | ⚠️ Streak +1 but reduced XP  |
| <100% completion                | ❌ Streak reset to 0         |
| No tasks created                | ⏸️ Streak paused (grace day) |

### Hide vs Delete

| Action     | Effect on Score         | Effect on Streak    |
| ---------- | ----------------------- | ------------------- |
| **Hide**   | Task ignored completely | No effect           |
| **Delete** | Counts as penalty       | Reduces daily score |

**Use Hide for:** Tasks added by mistake, duplicate tasks  
**Use Delete for:** Tasks you don't want to do (accepts penalty)

---

## ✨ Features

### Core Features

- ➕ **Create Tasks** — Add tasks with a single tap
- ✅ **Complete Tasks** — Check off tasks as you finish them
- 🗑️ **Delete Tasks** — Remove tasks (with penalty)
- 👁️ **Hide Tasks** — Hide without penalty (for mistakes)
- 📊 **Daily Progress** — See completion % in real-time
- 🔥 **Streak Counter** — Track consecutive perfect days
- 📈 **Level Display** — Current level with XP bar

### Gamification

- 🏆 **Level Badges** — Unlock badges at milestone levels
- 📅 **Streak Calendar** — Visual streak history
- 🎯 **Daily Goal** — Clear indicator of what's needed
- ⚡ **Streak Multiplier** — Bonus XP for longer streaks
- 💀 **Death Counter** — How many times you've reset

### Statistics

- 📊 **Completion Rate** — Overall task completion %
- 🔥 **Longest Streak** — Personal best
- 📈 **Level History** — Highest level reached
- 📉 **Penalty History** — Deleted task impact

---

## 🧮 Detailed Algorithm

### Daily Completion Check (runs at midnight or on demand)

```typescript
async function evaluateDay(userId: string, date: string): Promise<DayResult> {
  const tasks = await Task.find({ userId, date });

  if (tasks.length === 0) {
    return { status: "grace", message: "No tasks - streak paused" };
  }

  const active = tasks.filter((t) => t.state === "active");
  const completed = tasks.filter((t) => t.state === "completed");
  const deleted = tasks.filter((t) => t.state === "deleted");
  const hidden = tasks.filter((t) => t.state === "hidden");

  const countable = tasks.length - hidden.length;
  const completionRate = countable > 0 ? completed.length / countable : 0;
  const deletionPenalty = deleted.length / tasks.length;

  // Final score with deletion penalty
  const finalScore = completionRate * (1 - deletionPenalty * 0.5);

  // XP calculation
  const baseXP = 100;
  const streakBonus = user.currentStreak * 5; // +5 XP per streak day
  const earnedXP =
    Math.floor(baseXP * finalScore) + (finalScore === 1 ? streakBonus : 0);

  if (completionRate === 1) {
    // Perfect completion
    return {
      status: "success",
      streakContinues: true,
      xpEarned: earnedXP,
      penalty:
        deletionPenalty > 0
          ? `${Math.floor(deletionPenalty * 50)}% XP penalty`
          : null,
    };
  } else {
    // Incomplete - streak breaks
    return {
      status: "failed",
      streakContinues: false,
      xpEarned: 0,
      reason: `Only ${Math.floor(completionRate * 100)}% complete`,
    };
  }
}
```

### Level Progression

```typescript
function calculateLevel(streak: number): number {
  if (streak <= 0) return 1;
  return Math.floor((streak - 1) / 7) + 1;
}

function getXPProgress(streak: number): { current: number; required: number } {
  const level = calculateLevel(streak);
  const daysIntoLevel = ((streak - 1) % 7) + 1;
  return {
    current: daysIntoLevel,
    required: 7,
  };
}

// Level 1: Days 1-7   (need 7 days to level up)
// Level 2: Days 8-14  (need 7 more days)
// Level 3: Days 15-21 (need 7 more days)
```

---

## 🚀 Quick Start

### Mobile App

```bash
npm install
npx expo start
```

### Backend Server

```bash
cd api
npm install
cp .env.example .env   # Configure your environment
npm run dev
```

---

## 📱 Platforms

- ✅ iOS
- ✅ Android
- 🔜 Web (coming soon)

---

## 🛠️ Tech Stack

| Layer    | Technology                           |
| -------- | ------------------------------------ |
| Mobile   | Expo + React Native + TypeScript     |
| Backend  | Express + TypeScript                 |
| Database | MongoDB                              |
| Auth     | Google OAuth 2.0 + JWT               |
| Theme    | Solo Leveling inspired (purple/blue) |

---

## 📚 Documentation

- [Development Guide](./development.md) — Setup & contribution guide
- [API Documentation](./api/README.md) — Backend endpoints
- [Codebase Structure](./agents/agents.md) — Full project architecture

---

## 🎨 Theme

Inspired by the **Solo Leveling** anime aesthetic:

- Deep purple/violet accents
- Dark mysterious backgrounds
- Electric blue highlights
- Glowing UI effects

---

## 📄 License

MIT © 2024
