import {
	acceptRequest,
	cancelRequest,
	deleteConnection,
	incomingRequests,
	outgoingRequests,
	rejectRequest,
	sendRequest,
	showAllConnection,
} from "../services/connection.service.js";

export const sendRequestController = async (req, res) => {
	const result = await sendRequest(req.user.id, req.params.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};
export const acceptRequestController = async (req, res) => {
	const result = await acceptRequest(req.user.id, req.params.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};
export const rejectRequestController = async (req, res) => {
	const result = await rejectRequest(req.user.id, req.params.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};
export const cancelRequestController = async (req, res) => {
	const result = await cancelRequest(req.user.id, req.params.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};
export const incomingRequestsController = async (req, res) => {
	const result = await incomingRequests(req.user.id);
	res.status(result.status).json({
		message: result.message,
	});
};
export const outgoingRequestsController = async (req, res) => {
	const result = await outgoingRequests(req.user.id);
	res.status(result.status).json({
		message: result.message,
	});
};

export const showAllConnectionController = async (req, res) => {
	const result = await showAllConnection(req.user.id);
	res.status(result.status).json({
		message: result.message,
	});
};
export const deleteConnectionController = async (req, res) => {
	const result = await deleteConnection(
		req.user.id,
		req.params.publicId,
	);
	res.status(result.status).json({
		message: result.message,
	});
};
