import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import {authRoutes} from "./routes/auth.routes";
import { taskRoutes } from "./routes/task.routes";

const app = express();

app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/health", async (_req, res) => {
    const usersCount = await prisma.user.count();
    res.json({ status: "ok", usersCount });
});

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
    console.log(`API rodando http://localhost:${port}`);
});