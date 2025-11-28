# SoloLev Development Guide

## App Concept

A simple leveling app based on daily streaks. Complete your to-do list daily to maintain your streak and level up!

## How Leveling Works

| Days Streak | Level |
| ----------- | ----- |
| 1-7         | 1     |
| 8-14        | 2     |
| 15-21       | 3     |
| 22-28       | 4     |
| 29+         | 5+    |

**Formula:** `Level = Math.floor((streakDays - 1) / 7) + 1`

## Core Features

1. **Daily To-Do List** - Add tasks for the day
2. **Streak Tracker** - Track consecutive days of completion
3. **Level Display** - Show current level based on streak
4. **Progress Bar** - Days until next level

## Tech Stack

- **Framework:** Expo (React Native)
- **Platforms:** iOS & Android
- **Routing:** Expo Router (file-based)
- **Language:** TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Start development
npx expo start

# Run on specific platform
npm run ios      # iOS simulator
npm run android  # Android emulator
```

## Project Structure

```
app/
  (tabs)/
    index.tsx    # Home - Daily tasks & level
    explore.tsx  # Stats & history
  _layout.tsx    # Root layout
  modal.tsx      # Add task modal
components/      # Reusable UI components
hooks/           # Custom React hooks
constants/       # Theme & config
```

## Next Steps

1. [ ] Create task data model
2. [ ] Add local storage (AsyncStorage)
3. [ ] Build streak calculation logic
4. [ ] Design level-up UI/animations
5. [ ] Add notifications for daily reminders
