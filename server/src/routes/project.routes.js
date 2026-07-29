import { Router } from "express";
import {
	createProjectController,
	deleteProjectController,
	getProjectController,
	updateProjectController,
} from "../controllers/project.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
	createProjectSchema,
	updateProjectSchema,
} from "../validations/project.validation.js";
const router = Router();

router.post(
	"/",
	authenticateUser,
	validate(createProjectSchema),
	createProjectController,
);
router.get("/:publicId", getProjectController);
router.patch(
	"/:publicId",
	authenticateUser,
	validate(updateProjectSchema),
	updateProjectController,
);
router.delete("/:publicId", authenticateUser, deleteProjectController);

export default router;
