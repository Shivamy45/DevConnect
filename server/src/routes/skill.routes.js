import { Router } from "express";
import {
	createSkillController,
	listSkillsBySearchController,
} from "../controllers/skill.controller.js";
import validate from "../middlewares/validation.middleware.js";
import {
	createSkillSchema,
	searchSkillsSchema,
} from "../validations/skill.validation.js";

const router = Router();

router.post("/", validate(createSkillSchema), createSkillController);
router.get(
	"/search",
	validate(searchSkillsSchema),
	listSkillsBySearchController,
);

export default router;
