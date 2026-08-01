import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

import {
	updateProfileSchema,
	updateUsernameSchema,
	searchUsersSchema,
} from "../validations/user.validation.js";

import {
	getProfileController,
	updateProfileController,
	updateUsernameController,
	getUserProfileController,
	updateAvatarController,
	generateAvatarController,
	searchUsersController,
} from "../controllers/user.controller.js";
import validate from "../middlewares/validation.middleware.js";
import validateAvatarUpload from "../middlewares/avatar.middleware.js";

const router = Router();

router.post("/search", validate(searchUsersSchema), searchUsersController);

router.get("/me", authenticateUser, getProfileController);

router.patch(
	"/me",
	authenticateUser,
	validate(updateProfileSchema),
	updateProfileController,
);
router.patch(
	"/me/avatar",
	authenticateUser,
	validateAvatarUpload,
	updateAvatarController,
);

router.patch("/me/avatar/default", authenticateUser, generateAvatarController);

router.patch(
	"/me/username",
	authenticateUser,
	validate(updateUsernameSchema),
	updateUsernameController,
);

router.get("/:username", getUserProfileController);

export default router;
