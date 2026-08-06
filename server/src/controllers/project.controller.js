import {
	createProject,
	updateProject,
	getProjectByPublicId,
	deleteProject,
	listProjectsBySearch,
	leaveProject,
	removeProjectMember,
	updateProjectStatus,
} from "../services/project.service.js";

export const getProjectController = async (req, res) => {
	const result = await getProjectByPublicId(req.params.publicId);

	res.status(200).json({
		success: true,
		message: "Project found successfully",
		data: {
			project: result.project,
		},
	});
};

export const createProjectController = async (req, res) => {
	const result = await createProject(req.user.id, req.body);
	res.status(201).json({
		success: true,
		message: "Project created successfully",
		data: {
			project: result.project,
		},
	});
};

export const updateProjectController = async (req, res) => {
	const result = await updateProject(
		req.user.id,
		req.body,
		req.params.publicId,
	);
	res.status(200).json({
		success: true,
		message: "Project updated successfully",
		data: {
			project: result.project,
		},
	});
};

export const deleteProjectController = async (req, res) => {
	await deleteProject(req.user.id, req.params.publicId);
	res.status(200).json({
		success: true,
		message: "Project deleted successfully",
		data: null,
	});
};

export const searchProjectsController = async (req, res) => {
	const result = await listProjectsBySearch(req.body);

	res.status(200).json({
		success: true,
		message: "Projects fetched successfully",
		data: {
			projects: result.projects,
			pagination: result.pagination,
		},
	});
};

export const leaveProjectController = async (req, res) => {
	const result = await leaveProject(req.user.id, req.params.publicId);
	res.status(200).json({
		success: true,
		message: "Left project successfully",
		data: {
			project: result.project,
		},
	});
};

export const removeProjectMemberController = async (req, res) => {
	const result = await removeProjectMember(
		req.user.id,
		req.params.publicId,
		req.params.username,
	);
	res.status(200).json({
		success: true,
		message: "Project member removed successfully",
		data: {
			project: result.project,
		},
	});
};

export const updateProjectStatusController = async (req, res) => {
	const result = await updateProjectStatus(
		req.user.id,
		req.params.publicId,
		req.body.status,
	);
	res.status(200).json({
		success: true,
		message: "Project status updated successfully",
		data: {
			project: result.project,
		},
	});
};
