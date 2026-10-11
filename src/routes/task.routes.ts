import { Router } from "express";
import {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const taskRoutes = Router();

taskRoutes.use(authMiddleware);

taskRoutes.post("/", createTask);
taskRoutes.get("/", listTasks);
taskRoutes.patch("/:id", updateTask);
taskRoutes.delete("/:id", deleteTask);