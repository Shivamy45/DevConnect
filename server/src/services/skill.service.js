import { nanoid } from "nanoid";
import skillModel from "../models/skill.model.js";
import ApiError from "../utils/ApiError.js";

export const normalizeSkillName = (name) => name.trim().toLowerCase();

const isSkillPublicId = (value) => /^SKL_[A-Za-z0-9_-]{12}$/.test(value);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const formatSkill = (skill) => ({
	publicId: skill.publicId,
	name: skill.name,
	category: skill.category,
	icon: skill.icon ?? null,
});

export const listSkillsBySearch = async (query) => {
	const searchText = query.trim();

	const skills = await skillModel
		.find({
			name: {
				$regex: escapeRegex(searchText),
				$options: "i",
			},
		})
		.select("publicId name category icon -_id")
		.sort({ name: 1 })
		.collation({ locale: "en", strength: 2 })
		.limit(10)
		.lean();

	return {
		skills: skills.map(formatSkill),
	};
};

export const createSkill = async (skillName) => {
	const normalizedSkillName = normalizeSkillName(skillName);

	if (!normalizedSkillName) {
		throw new ApiError(400, "Skill name is required");
	}

	const existingSkill = await skillModel
		.findOne({ name: normalizedSkillName })
		.collation({ locale: "en", strength: 2 });

	if (existingSkill) {
		return {
			skill: formatSkill(existingSkill),
			created: false,
		};
	}

	try {
		const skill = await skillModel.create({
			publicId: "SKL_" + nanoid(12),
			name: normalizedSkillName,
			category: "GENERAL",
		});

		return {
			skill: formatSkill(skill),
			created: true,
		};
	} catch (error) {
		if (error?.code !== 11000) throw error;

		const skill = await skillModel
			.findOne({ name: normalizedSkillName })
			.collation({ locale: "en", strength: 2 });

		if (skill) {
			return {
				skill: formatSkill(skill),
				created: false,
			};
		}

		throw error;
	}
};

const resolveSkillValue = async (value) => {
	const skillValue = value.trim();

	if (!skillValue) {
		throw new ApiError(400, "Skill name is required");
	}

	if (!isSkillPublicId(skillValue)) {
		throw new ApiError(400, "Invalid skill public ID");
	}

	const skill = await skillModel.findOne({ publicId: skillValue });

	if (!skill) {
		throw new ApiError(400, "Skill not found");
	}

	return skill._id;
};

export const resolveSkills = async (skills = []) => {
	const resolvedSkills = [];

	for (const skillDetails of skills) {
		if (typeof skillDetails === "string") {
			resolvedSkills.push(await resolveSkillValue(skillDetails));
			continue;
		}

		resolvedSkills.push({
			...skillDetails,
			skill: await resolveSkillValue(skillDetails.skill),
		});
	}

	return resolvedSkills;
};
