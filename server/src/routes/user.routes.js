import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

import {
	updateProfileSchema,
	updateUsernameSchema,
} from "../validations/user.validation.js";

import {
	getProfileController,
	updateProfileController,
	updateUsernameController,
	getUserProfileController,
	updateAvatarController,
	generateAvatarController,
} from "../controllers/user.controller.js";
import validate from "../middlewares/validation.middleware.js";

const router = Router();

router.get("/me", authenticateUser, getProfileController);

router.patch(
	"/me",
	authenticateUser,
	validate(updateProfileSchema),
	updateProfileController,
);
router.patch("/me/avatar", authenticateUser, updateAvatarController);

router.patch("/me/avatar/default", authenticateUser, generateAvatarController);

router.get("/:username", getUserProfileController);

router.patch(
	"/username",
	authenticateUser,
	validate(updateUsernameSchema),
	updateUsernameController,
);

export default router;
