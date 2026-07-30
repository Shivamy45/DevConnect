import projectModel from "../models/project.model.js";
import skillModel from "../models/skill.model.js";
import ApiError from "../utils/ApiError.js";
import { nanoid } from "nanoid";

export const createProject = async (userId, projectDetails) => {
	if (projectDetails.requiredSkills?.length) {
		const isSkill = await skillModel.find({
			_id: { $in: projectDetails.requiredSkills },
		});
		if (isSkill.length !== projectDetails.requiredSkills.length) {
			throw new ApiError(400, "One or more skills not found");
		}
		projectDetails.requiredSkills = [...new Set(projectDetails.requiredSkills)];
	}
	const project = await projectModel.create({
		...projectDetails,
		publicId: "PRJ_" + nanoid(12),
		owner: userId,
	});
	return {
		project,
	};
};

export const getProjectByPublicId = async (projectId) => {
	const project = await projectModel
		.findOne({ publicId: projectId })
		.populate("owner requiredSkills");
	if (!project) {
		throw new ApiError(404, "Project not found");
	}
	return {
		project,
	};
};

export const updateProject = async (
	userId,
	projectDetails,
	projectPublicId,
) => {
	if (Object.keys(projectDetails).length === 0)
		throw new ApiError(400, "No changes found");
	if (projectDetails.requiredSkills?.length) {
		const isSkill = await skillModel.find({
			_id: { $in: projectDetails.requiredSkills },
		});
		if (isSkill.length !== projectDetails.requiredSkills.length) {
			throw new ApiError(400, "One or more skills not found");
		}
		projectDetails.requiredSkills = [
			...new Set(projectDetails.requiredSkills),
		];
	}
	const project = await projectModel.findOne({
		publicId: projectPublicId,
	});
	if (!project) {
		throw new ApiError(404, "Project not found");
	}
	if (!project.owner.equals(userId)) {
		throw new ApiError(403, "You are not authorized for this operation");
	}
	for (const [key, value] of Object.entries(projectDetails)) {
		if (value !== undefined) project[key] = value;
	}
	await project.save();
	return {
		project,
	};
};

export const deleteProject = async (userId, projectPublicId) => {
	const project = await projectModel.findOne({
		publicId: projectPublicId,
	});
	if (!project) {
		throw new ApiError(404, "Project not found");
	}
	if (!project.owner.equals(userId)) {
		throw new ApiError(403, "You are not authorized for this operation");
	}
	await project.deleteOne();
	return null;
};
