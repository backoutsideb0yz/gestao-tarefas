import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./Lib/prisma";

const app = express();

app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());

app.get("/health", async (_req, res) => {
    const usersCount = await prisma.user.count();
    res.json({ status: "ok", usersCount });
});

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
    console.log(`API rodando http://localhost:${port}`);
});