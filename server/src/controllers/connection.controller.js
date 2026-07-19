import {
	acceptRequest,
	cancelRequest,
	deleteConnection,
	incomingRequests,
	outgoingRequests,
	rejectRequest,
	sendRequest,
	showAllConnection,
} from "../services/connection.service";

export const sendRequestController = async (req, res) => {
	const result = await sendRequest(req.user.publicId, req.body.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};
export const acceptRequestController = async (req, res) => {
	const result = await acceptRequest(req.user.publicId, req.params.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};
export const rejectRequestController = async (req, res) => {
	const result = await rejectRequest(req.user.publicId, req.params.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};
export const cancelRequestController = async (req, res) => {
	const result = await cancelRequest(req.user.publicId, req.params.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};
export const incomingRequestsController = async (req, res) => {
	const result = await incomingRequests(req.user.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};
export const outgoingRequestsController = async (req, res) => {
	const result = await outgoingRequests(req.user.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};

export const showAllConnectionController = async (req, res) => {
	const result = await showAllConnection(req.user.publicId);
	res.status(result.status).json({
		message: result.message,
	});
};
export const deleteConnectionController = async (req, res) => {
	const result = await deleteConnection(
		req.user.publicId,
		req.params.publicId,
	);
	res.status(result.status).json({
		message: result.message,
	});
};
