import { Router } from "express";
import {
	loginController,
	refreshTokenController,
	registerController,
} from "../controllers/auth.controller.js";
import validate from "../middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/login", validate(loginSchema), loginController);
router.post("/register", validate(registerSchema), registerController);
router.post("/refreshToken", refreshTokenController);

export default router;
