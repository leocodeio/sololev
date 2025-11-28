export interface User {
  id: string;
  name: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  userId: string;
  streak: number;
  level: number;
  daysToNextLevel: number;
  totalTasksCompleted: number;
}

export interface CreateUserDto {
  name: string;
}

// Level calculation: every 7 days = 1 level
export function calculateLevel(streakDays: number): number {
  if (streakDays <= 0) return 1;
  return Math.floor((streakDays - 1) / 7) + 1;
}

export function daysToNextLevel(streakDays: number): number {
  const currentLevel = calculateLevel(streakDays);
  const daysForNextLevel = currentLevel * 7;
  return daysForNextLevel - streakDays + 1;
}
