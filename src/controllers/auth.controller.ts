import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { registerSchema } from "../schemas/auth.schema";

export async function register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Dados inválidos",
            errors: parsed.error.flatten().fieldErrors,
        });
    }

    
    const { name, email, password } = parsed.data;

    const emailInUse = await prisma.user.findUnique({ where: { email } });

    if (emailInUse) {
        return res.status(409).json({ message: "Email já cadastrado"});
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { name, email, password: passwordHash },
        select: {id: true, name: true, email: true, createdAt: true},

    });

    return res.status(201).json(user);
}