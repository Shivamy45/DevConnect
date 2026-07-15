import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", authenticateUser, getProfile);

router.get("/:username", getUserProfile);

export default router;
