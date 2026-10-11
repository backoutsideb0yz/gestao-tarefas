import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";

function toDate(value: string | null | undefined) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return new Date(value);
}

export async function createTask(req: Request, res: Response) {
  const parsed = createTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const task = await prisma.task.create({
  data: {
    ...parsed.data,
    dueDate: toDate(parsed.data.dueDate),
    userId: req.userId as string,
  },
  
});
  return res.status(201).json(task);
}

export async function listTasks(req: Request, res: Response) {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });

  return res.json(tasks);
}

export async function updateTask(req: Request, res: Response) {
  const id = req.params.id as string;

  const parsed = updateTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const task = await prisma.task.findFirst({
    where: { id, userId: req.userId },
  });

  if (!task) {
    return res.status(404).json({ message: "Tarefa não encontrada" });
  }

  const updated = await prisma.task.update({
    where: { id },
    data: { ...parsed.data, dueDate: toDate(parsed.data.dueDate) },
  });

  return res.json(updated);
}

export async function deleteTask(req: Request, res: Response) {
  const id = req.params.id as string;

  const task = await prisma.task.findFirst({
    where: { id, userId: req.userId },
  });

  if (!task) {
    return res.status(404).json({ message: "Tarefa não encontrada" });
  }

  await prisma.task.delete({ where: { id } });

  return res.status(204).send();
}
