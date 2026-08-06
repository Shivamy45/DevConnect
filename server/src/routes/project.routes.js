import { Router } from "express";
import {
	createProjectController,
	deleteProjectController,
	getProjectController,
	leaveProjectController,
	removeProjectMemberController,
	searchProjectsController,
	updateProjectController,
	updateProjectStatusController,
} from "../controllers/project.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
	completeProjectSchema,
	createProjectSchema,
	leaveProjectSchema,
	removeProjectMemberSchema,
	searchProjectsSchema,
	updateProjectSchema,
} from "../validations/project.validation.js";
import { publicIdParamSchema } from "../validations/common.validation.js";
const router = Router();

router.post(
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

router.patch(
	"/:publicId/status",
	authenticateUser,
	validate(completeProjectSchema),
	updateProjectStatusController,
);
router.delete(
	"/:publicId/members/me",
	authenticateUser,
	validate(leaveProjectSchema),
	leaveProjectController,
);
router.delete(
	"/:publicId/members/:username",
	authenticateUser,
	validate(removeProjectMemberSchema),
	removeProjectMemberController,
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
