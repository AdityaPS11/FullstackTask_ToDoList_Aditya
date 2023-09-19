// src/routes/taskRoutes.ts
import express, { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';

const router = express.Router();

// Add a new task
router.post('/add', async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    const task = new Task({ description });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all tasks
router.get('/fetchAllTasks', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
