import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Título obrigatório").max(120),
  description: z.string().trim().max(1000).optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Título obrigatório").max(120),
    description: z.string().trim().max(1000).nullable(),
    done: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie ao menos um campo para atualizar",
  });