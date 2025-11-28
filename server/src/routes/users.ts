import { Request, Response, Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { Task } from "../models/Task";
import { IUser, User } from "../models/User";
import { calculateLevel, daysToNextLevel } from "../types/user";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Get current user profile
router.get("/me", async (req: Request, res: Response) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Get user progress (level, streak, etc.)
router.get("/me/progress", async (req: Request, res: Response) => {
  try {
    const user = req.user! as IUser;
    const totalTasksCompleted = await Task.countDocuments({
      userId: req.userId,
      completed: true,
    });

    const progress = {
      userId: user._id,
      streak: user.currentStreak,
      level: calculateLevel(user.currentStreak),
      daysToNextLevel: daysToNextLevel(user.currentStreak),
      longestStreak: user.longestStreak,
      totalTasksCompleted,
    };

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// Complete day (called when all tasks are done)
router.post("/me/complete-day", async (req: Request, res: Response) => {
  try {
    const user = req.user! as IUser;
    const today = new Date().toISOString().split("T")[0];

    // Check if all today's tasks are completed
    const todayTasks = await Task.find({ userId: req.userId, date: today });
    const allCompleted =
      todayTasks.length > 0 && todayTasks.every((t) => t.completed);

    if (!allCompleted) {
      return res
        .status(400)
        .json({ error: "Not all tasks completed for today" });
    }

    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const lastCompleted = user.lastCompletedDate?.toISOString().split("T")[0];

    // Check if streak continues or resets
    let newStreak = 1;
    if (lastCompleted === yesterday) {
      newStreak = user.currentStreak + 1;
    } else if (lastCompleted === today) {
      // Already completed today
      return res.json({
        message: "Already completed today",
        progress: {
          streak: user.currentStreak,
          level: calculateLevel(user.currentStreak),
          daysToNextLevel: daysToNextLevel(user.currentStreak),
        },
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        currentStreak: newStreak,
        longestStreak: Math.max(user.longestStreak, newStreak),
        lastCompletedDate: new Date(),
      },
      { new: true }
    );

    const progress = {
      streak: newStreak,
      level: calculateLevel(newStreak),
      daysToNextLevel: daysToNextLevel(newStreak),
      longestStreak: updatedUser!.longestStreak,
    };

    res.json({ user: updatedUser, progress });
  } catch (error) {
    res.status(500).json({ error: "Failed to complete day" });
  }
});

export const userRoutes = router;
