import projectModel from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";
import { nanoid } from "nanoid";
import { resolveSkills } from "./skill.service.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const formatSkill = (skill) => ({
	publicId: skill.publicId,
	name: skill.name,
	category: skill.category,
	icon: skill.icon ?? null,
});

const formatOwner = (owner) => ({
	publicId: owner.publicId,
	username: owner.username,
	name: owner.name,
	profilePic: owner.profilePic,
	developerType: owner.developerType,
});

const formatPublicProject = (project) => ({
	publicId: project.publicId,
	title: project.title,
	description: project.description,
	owner: project.owner ? formatOwner(project.owner) : null,
	visibility: project.visibility,
	requiredSkills: project.requiredSkills?.map(formatSkill) ?? [],
	externalLinks: project.externalLinks,
	coverImage: project.coverImage,
	status: project.status,
	maxMembers: project.maxMembers,
	createdAt: project.createdAt,
	updatedAt: project.updatedAt,
});

export const createProject = async (userId, projectDetails) => {
	if (projectDetails.requiredSkills?.length) {
		const resolvedSkills = await resolveSkills(
			projectDetails.requiredSkills,
		);
		const uniqueRequiredSkills = [
			...new Map(
				resolvedSkills.map((id) => [id.toString(), id]),
			).values(),
		];

		projectDetails.requiredSkills = uniqueRequiredSkills;
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
		const resolvedSkills = await resolveSkills(
			projectDetails.requiredSkills,
		);
		projectDetails.requiredSkills = [
			...new Map(
				resolvedSkills.map((skillId) => [skillId.toString(), skillId]),
			).values(),
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

export const listProjectsBySearch = async ({
	q,
	requiredSkills,
	status,
	sort,
	page,
	limit,
}) => {
	const filter = {
		visibility: "PUBLIC",
	};

	if (q) {
		filter.title = {
			$regex: escapeRegex(q),
			$options: "i",
		};
	}

	if (status) {
		filter.status = status;
	}

	if (requiredSkills?.length) {
		const resolvedSkills = await resolveSkills(requiredSkills);
		const uniqueRequiredSkills = [
			...new Map(
				resolvedSkills.map((skillId) => [skillId.toString(), skillId]),
			).values(),
		];

		filter.requiredSkills = { $all: uniqueRequiredSkills };
	}

	const sortOptions = {
		best_match: { title: 1 },
		newest: { createdAt: -1 },
		oldest: { createdAt: 1 },
	};
	const skip = (page - 1) * limit;

	const query = projectModel
		.find(filter)
		.select(
			"publicId title description owner visibility requiredSkills externalLinks coverImage status maxMembers createdAt updatedAt -_id",
		)
		.populate({
			path: "owner",
			select: "publicId username name profilePic developerType -_id",
		})
		.populate({
			path: "requiredSkills",
			select: "publicId name category icon -_id",
		})
		.sort(sortOptions[sort])
		.collation({ locale: "en", strength: 2 })
		.skip(skip)
		.limit(limit)
		.lean();

	const [projects, total] = await Promise.all([
		query,
		projectModel.countDocuments(filter),
	]);

	return {
		projects: projects.map(formatPublicProject),
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};
