import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { nanoid } from "nanoid";
import { resolveSkills } from "./skill.service.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getTeamSize = (project) => project.members.length + 1;

export const recalculateProjectStatus = (project) => {
	if (project.status === "COMPLETED") {
		return;
	}

	const teamSize = getTeamSize(project);
	if (teamSize >= project.maxMembers) {
		project.status = "IN_PROGRESS";
	} else {
		project.status = "OPEN";
	}
};

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
	if (project.status === "COMPLETED") {
		if (
			projectDetails.maxMembers !== undefined ||
			projectDetails.requiredSkills !== undefined
		) {
			throw new ApiError(
				400,
				"Cannot modify recruitment settings of a completed project",
			);
		}
	}
	if (projectDetails.maxMembers !== undefined) {
		const teamSize = getTeamSize(project);
		if (projectDetails.maxMembers < teamSize) {
			throw new ApiError(
				400,
				"maxMembers cannot be less than current team size",
			);
		}
	}
	for (const [key, value] of Object.entries(projectDetails)) {
		if (value !== undefined) project[key] = value;
	}
	recalculateProjectStatus(project);
	await project.save();
	return {
		project,
	};
};

export const leaveProject = async (userId, projectPublicId) => {
	const project = await projectModel.findOne({
		publicId: projectPublicId,
	});
	if (!project) {
		throw new ApiError(404, "Project not found");
	}
	if (project.status === "COMPLETED") {
		throw new ApiError(400, "Cannot leave a completed project");
	}
	if (project.owner.equals(userId)) {
		throw new ApiError(400, "Project owner cannot leave the project");
	}
	const memberIndex = project.members.findIndex((member) =>
		member.userId.equals(userId),
	);
	if (memberIndex === -1) {
		throw new ApiError(403, "You are not a member of this project");
	}
	project.members.splice(memberIndex, 1);
	recalculateProjectStatus(project);
	await project.save();
	return {
		project,
	};
};

export const removeProjectMember = async (
	ownerId,
	projectPublicId,
	username,
) => {
	const project = await projectModel.findOne({
		publicId: projectPublicId,
	});
	if (!project) {
		throw new ApiError(404, "Project not found");
	}
	if (!project.owner.equals(ownerId)) {
		throw new ApiError(403, "You are not authorized for this operation");
	}
	if (project.status === "COMPLETED") {
		throw new ApiError(
			400,
			"Cannot remove members from a completed project",
		);
	}
	const user = await userModel.findOne({ username });
	if (!user) {
		throw new ApiError(404, "User not found");
	}
	if (project.owner.equals(user._id)) {
		throw new ApiError(400, "Project owner cannot be removed");
	}
	const memberIndex = project.members.findIndex((member) =>
		member.userId.equals(user._id),
	);
	if (memberIndex === -1) {
		throw new ApiError(404, "User is not a member of this project");
	}
	project.members.splice(memberIndex, 1);
	recalculateProjectStatus(project);
	await project.save();
	return {
		project,
	};
};

export const updateProjectStatus = async (ownerId, projectPublicId, status) => {
	const project = await projectModel.findOne({
		publicId: projectPublicId,
	});
	if (!project) {
		throw new ApiError(404, "Project not found");
	}
	if (!project.owner.equals(ownerId)) {
		throw new ApiError(403, "You are not authorized for this operation");
	}
	if (status !== "COMPLETED") {
		throw new ApiError(400, "Only project completion is supported");
	}
	if (project.status !== "IN_PROGRESS") {
		throw new ApiError(
			400,
			"Project must be in progress before it can be completed",
		);
	}
	project.status = "COMPLETED";
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
