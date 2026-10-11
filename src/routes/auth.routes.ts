import { Router } from "express";
import { register, login, me} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/me", authMiddleware, me);
