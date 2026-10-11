import { z } from "zod";

const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Título obrigatório").max(120),
  description: z.string().trim().max(1000).optional(),
  priority: prioritySchema.optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Título obrigatório").max(120),
    description: z.string().trim().max(1000).nullable(),
    done: z.boolean(),
    priority: prioritySchema,
    dueDate: z.string().datetime().nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie ao menos um campo para atualizar",
  });