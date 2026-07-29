import {
	createProject,
	updateProject,
	getProjectByPublicId,
	deleteProject,
} from "../services/project.service.js";

export const getProjectController = async (req, res) => {
	const result = await getProjectByPublicId(req.params.publicId);

	res.status(result.status).json({
		message: result.message,
		project: result.project,
	});
};

export const createProjectController = async (req, res) => {
	const result = await createProject(req.user.id, req.body);
	res.status(result.status).json({
		message: result.message,
		project: result.project,
	});
};

export const updateProjectController = async (req, res) => {
	const result = await updateProject(
		req.user.id,
		req.body,
		req.params.publicId,
	);
	res.status(result.status).json({
		message: result.message,
		project: result.project,
	});
};

export const deleteProjectController = async (req, res) => {
	const result = await deleteProject(req.user.id, req.params.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};
