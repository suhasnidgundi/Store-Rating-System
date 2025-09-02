import { Router } from "express";
import { register, login, refresh } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../utils/validation";
import { authLimiter } from "../middleware/rateLimiter.middleware";

export const authRouter = Router();

authRouter.post("/register", authLimiter, validate(registerSchema), register);
authRouter.post("/login", authLimiter, validate(loginSchema), login);
authRouter.post("/refresh", authLimiter, validate(refreshSchema), refresh);
