import { Router } from "express";
import {
	createProjectController,
	deleteProjectController,
	getProjectController,
	searchProjectsController,
	updateProjectController,
} from "../controllers/project.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
	createProjectSchema,
	searchProjectsSchema,
	updateProjectSchema,
} from "../validations/project.validation.js";
import { publicIdParamSchema } from "../validations/common.validation.js";
const router = Router();

router.get(
	"/search",
	validate(searchProjectsSchema),
	searchProjectsController,
);

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
	validate(publicIdParamSchema("PRJ_", "project")),
	updateProjectController,
);
router.delete(
	"/:publicId",
	authenticateUser,
	validate(publicIdParamSchema("PRJ_", "project")),
	deleteProjectController,
);

export default router;
