import collaborationRequestModel from "../models/collaborationRequest.model.js";
import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
import { recalculateProjectStatus } from "./project.service.js";
import ApiError from "../utils/ApiError.js";
import { nanoid } from "nanoid";

const formatUser = (user) => ({
	publicId: user.publicId,
	username: user.username,
	name: user.name,
	profilePic: user.profilePic,
	developerType: user.developerType,
});

const formatProject = (project) => ({
	publicId: project.publicId,
	title: project.title,
	description: project.description,
	status: project.status,
	maxMembers: project.maxMembers,
	owner: project.owner ? formatUser(project.owner) : null,
});

const formatCollaborationRequest = (request) => ({
	publicId: request.publicId,
	project: request.projectId ? formatProject(request.projectId) : null,
	sender: request.senderId ? formatUser(request.senderId) : null,
	receiver: request.receiverId ? formatUser(request.receiverId) : null,
	type: request.type,
	status: request.status,
	message: request.message ?? null,
	createdAt: request.createdAt,
	updatedAt: request.updatedAt,
});

const requestPopulateOptions = [
	{
		path: "projectId",
		select: "publicId title description status maxMembers owner -_id",
		populate: {
			path: "owner",
			select: "publicId username name profilePic developerType -_id",
		},
	},
	{
		path: "senderId",
		select: "publicId username name profilePic developerType -_id",
	},
	{
		path: "receiverId",
		select: "publicId username name profilePic developerType -_id",
	},
];

const getProjectByPublicId = async (projectPublicId) => {
	const project = await projectModel.findOne({ publicId: projectPublicId });
	if (!project) {
		throw new ApiError(404, "Project not found");
	}
	return project;
};

const isProjectMember = (project, userId) =>
	project.members.some((member) => member.userId.equals(userId));

const isProjectFull = (project) =>
	1 + project.members.length >= project.maxMembers;

const assertProjectOpen = (project) => {
	if (project.status !== "OPEN") {
		throw new ApiError(400, "Project is not open for collaboration");
	}
};

const assertProjectNotFull = (project) => {
	if (isProjectFull(project)) {
		throw new ApiError(409, "Project is full");
	}
};

const findPendingProjectRequestForUser = (projectId, userId) =>
	collaborationRequestModel.findOne({
		projectId,
		status: "PENDING",
		$or: [{ senderId: userId }, { receiverId: userId }],
	});

const populateRequest = (request) =>
	request.populate(requestPopulateOptions);

export const createCollaborationApplication = async (
	applicantId,
	{ projectPublicId, message },
) => {
	const project = await getProjectByPublicId(projectPublicId);

	assertProjectOpen(project);
	assertProjectNotFull(project);

	if (project.owner.equals(applicantId)) {
		throw new ApiError(400, "Project owner cannot apply to their own project");
	}

	if (isProjectMember(project, applicantId)) {
		throw new ApiError(409, "You are already a member of this project");
	}

	const existingPending = await findPendingProjectRequestForUser(
		project._id,
		applicantId,
	);
	if (existingPending) {
		throw new ApiError(
			409,
			"A pending collaboration request already exists for this project",
		);
	}

	const request = await collaborationRequestModel.create({
		publicId: "CRQ_" + nanoid(12),
		projectId: project._id,
		senderId: applicantId,
		receiverId: project.owner,
		type: "APPLICATION",
		message,
	});

	await populateRequest(request);

	return {
		collaborationRequest: formatCollaborationRequest(request),
	};
};

export const createCollaborationInvitation = async (
	ownerId,
	{ projectPublicId, username, message },
) => {
	const project = await getProjectByPublicId(projectPublicId);

	if (!project.owner.equals(ownerId)) {
		throw new ApiError(
			403,
			"You are not authorized to invite collaborators to this project",
		);
	}

	assertProjectOpen(project);
	assertProjectNotFull(project);

	const invitedUser = await userModel.findOne({ username });
	if (!invitedUser) {
		throw new ApiError(404, "User not found");
	}

	if (ownerId.equals(invitedUser._id)) {
		throw new ApiError(400, "Project owner cannot invite themselves");
	}

	if (isProjectMember(project, invitedUser._id)) {
		throw new ApiError(409, "User is already a member of this project");
	}

	const existingPending = await findPendingProjectRequestForUser(
		project._id,
		invitedUser._id,
	);
	if (existingPending) {
		throw new ApiError(
			409,
			"A pending collaboration request already exists for this user and project",
		);
	}

	const request = await collaborationRequestModel.create({
		publicId: "CRQ_" + nanoid(12),
		projectId: project._id,
		senderId: ownerId,
		receiverId: invitedUser._id,
		type: "INVITATION",
		message,
	});

	await populateRequest(request);

	return {
		collaborationRequest: formatCollaborationRequest(request),
	};
};

export const updateCollaborationRequestAccepted = async (
	userId,
	requestPublicId,
) => {
	const request = await collaborationRequestModel.findOne({
		publicId: requestPublicId,
	});
	if (!request) {
		throw new ApiError(404, "Collaboration request not found");
	}

	if (!request.receiverId.equals(userId)) {
		throw new ApiError(
			403,
			"You are not authorized to accept this collaboration request",
		);
	}

	if (request.status !== "PENDING") {
		throw new ApiError(
			409,
			`Collaboration request is already ${request.status.toLowerCase()}`,
		);
	}

	const project = await projectModel.findById(request.projectId);
	if (!project) {
		throw new ApiError(404, "Project not found");
	}

	assertProjectOpen(project);
	assertProjectNotFull(project);

	const memberUserId =
		request.type === "APPLICATION"
			? request.senderId
			: request.receiverId;

	if (project.owner.equals(memberUserId)) {
		throw new ApiError(400, "Project owner cannot be added as a member");
	}

	if (isProjectMember(project, memberUserId)) {
		throw new ApiError(409, "User is already a member of this project");
	}

	project.members.push({ userId: memberUserId });
	recalculateProjectStatus(project);
	await project.save();

	request.status = "ACCEPTED";
	await request.save();
	await populateRequest(request);

	return {
		collaborationRequest: formatCollaborationRequest(request),
	};
};

export const updateCollaborationRequestRejected = async (
	userId,
	requestPublicId,
) => {
	const request = await collaborationRequestModel.findOne({
		publicId: requestPublicId,
	});
	if (!request) {
		throw new ApiError(404, "Collaboration request not found");
	}

	if (!request.receiverId.equals(userId)) {
		throw new ApiError(
			403,
			"You are not authorized to reject this collaboration request",
		);
	}

	if (request.status !== "PENDING") {
		throw new ApiError(
			409,
			`Collaboration request is already ${request.status.toLowerCase()}`,
		);
	}

	request.status = "REJECTED";
	await request.save();
	await populateRequest(request);

	return {
		collaborationRequest: formatCollaborationRequest(request),
	};
};

export const updateCollaborationRequestCancelled = async (
	userId,
	requestPublicId,
) => {
	const request = await collaborationRequestModel.findOne({
		publicId: requestPublicId,
	});
	if (!request) {
		throw new ApiError(404, "Collaboration request not found");
	}

	if (request.status !== "PENDING") {
		throw new ApiError(
			409,
			`Collaboration request is already ${request.status.toLowerCase()}`,
		);
	}

	if (request.type === "APPLICATION") {
		if (!request.senderId.equals(userId)) {
			throw new ApiError(
				403,
				"You are not authorized to cancel this collaboration request",
			);
		}
	} else if (!request.senderId.equals(userId)) {
		throw new ApiError(
			403,
			"You are not authorized to cancel this collaboration request",
		);
	}

	request.status = "CANCELLED";
	await request.save();
	await populateRequest(request);

	return {
		collaborationRequest: formatCollaborationRequest(request),
	};
};

export const listOutgoingCollaborationApplications = async (userId) => {
	const requests = await collaborationRequestModel
		.find({
			senderId: userId,
			type: "APPLICATION",
		})
		.sort({ createdAt: -1 })
		.populate(requestPopulateOptions);

	return {
		collaborationRequests: requests.map(formatCollaborationRequest),
	};
};

export const listIncomingCollaborationApplications = async (userId) => {
	const requests = await collaborationRequestModel
		.find({
			receiverId: userId,
			type: "APPLICATION",
		})
		.sort({ createdAt: -1 })
		.populate(requestPopulateOptions);

	return {
		collaborationRequests: requests.map(formatCollaborationRequest),
	};
};

export const listIncomingCollaborationInvitations = async (userId) => {
	const requests = await collaborationRequestModel
		.find({
			receiverId: userId,
			type: "INVITATION",
		})
		.sort({ createdAt: -1 })
		.populate(requestPopulateOptions);

	return {
		collaborationRequests: requests.map(formatCollaborationRequest),
	};
};

export const listOutgoingCollaborationInvitations = async (userId) => {
	const requests = await collaborationRequestModel
		.find({
			senderId: userId,
			type: "INVITATION",
		})
		.sort({ createdAt: -1 })
		.populate(requestPopulateOptions);

	return {
		collaborationRequests: requests.map(formatCollaborationRequest),
	};
};
