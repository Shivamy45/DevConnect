import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

import { updateProfileSchema } from "../validations/user.validation.js";

import {
	getProfileController,
	updateProfileController,
	getUserProfileController,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", authenticateUser, getProfileController);

router.patch(
	"/profile",
	authenticateUser,
	updateProfileSchema,
	updateProfileController,
);

router.get("/:username", getUserProfileController);

router.patch(
	"/username",
	authenticateUser,
	updateUsernameSchema,
	updateUsernameController,
);

export default router;
