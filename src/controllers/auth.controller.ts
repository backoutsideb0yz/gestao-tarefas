import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

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
    return res.status(409).json({ message: "Email já cadastrado" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: passwordHash },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  const passwordOk = user
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!user || !passwordOk) {
    return res.status(401).json({ message: "Email ou senha inválidos" });
  }

  const token = jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any }
  );

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  return res.json(user);
}