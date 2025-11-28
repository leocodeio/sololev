import { Request, Response, Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { Task } from "../models/Task";

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// Get all tasks for authenticated user (optionally filter by date)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const query: any = { userId: req.userId };

    if (date) {
      query.date = date;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Get tasks for today
router.get("/today", async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const tasks = await Task.find({ userId: req.userId, date: today }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create a new task
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, date } = req.body;

    const task = await Task.create({
      userId: req.userId,
      title,
      completed: false,
      date: date || new Date().toISOString().split("T")[0],
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update a task (toggle complete, edit title)
router.patch("/:taskId", async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.userId },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete a task
router.delete("/:taskId", async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export const taskRoutes = router;
