import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
    email: z.string().trim().toLowerCase().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Email inválido"),
    password: z.string().min(1, "Senha obrigatória"),
});