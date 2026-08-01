import { createSkill, listSkillsBySearch } from "../services/skill.service.js";

export const listSkillsBySearchController = async (req, res) => {
	const result = await listSkillsBySearch(req.query.q);

	res.status(200).json({
		success: true,
		message: "Skills fetched successfully",
		data: {
			skills: result.skills,
		},
	});
};

export const createSkillController = async (req, res) => {
	const result = await createSkill(req.body.name);

	res.status(result.created ? 201 : 200).json({
		success: true,
		message: result.created
			? "Skill created successfully"
			: "Skill fetched successfully",
		data: {
			skill: result.skill,
		},
	});
};
