import { Router } from "express";
import {
	loginController,
	signUpController,
} from "../controllers/auth.controller.js";
import validate from "../middlewares/validation.middleware.js";
import { loginSchema, signUpSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/login", validate(loginSchema), loginController);
router.post("/signup", validate(signUpSchema), signUpController);

export default router;
