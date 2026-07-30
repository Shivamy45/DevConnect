import {
	createConnectionRequest,
	deleteConnection,
	listConnections,
	listIncomingConnectionRequests,
	listOutgoingConnectionRequests,
	updateConnectionRequestAccepted,
	updateConnectionRequestCancelled,
	updateConnectionRequestRejected,
} from "../services/connection.service.js";

export const createConnectionRequestController = async (req, res) => {
	const result = await createConnectionRequest(
		req.user.id,
		req.params.publicId,
	);
	res.status(200).json({
		success: true,
		message: "Connection Request Sent",
		data: result,
	});
};
export const updateConnectionRequestAcceptedController = async (req, res) => {
	const result = await updateConnectionRequestAccepted(
		req.user.id,
		req.params.publicId,
	);
	res.status(200).json({
		success: true,
		message: "Connection request accepted",
		data: result,
	});
};
export const updateConnectionRequestRejectedController = async (req, res) => {
	const result = await updateConnectionRequestRejected(
		req.user.id,
		req.params.publicId,
	);
	res.status(200).json({
		success: true,
		message: "Connection request rejected",
		data: result,
	});
};
export const updateConnectionRequestCancelledController = async (req, res) => {
	const result = await updateConnectionRequestCancelled(
		req.user.id,
		req.params.publicId,
	);
	res.status(200).json({
		success: true,
		message: "Connection request cancelled",
		data: result,
	});
};
export const listIncomingConnectionRequestsController = async (req, res) => {
	const result = await listIncomingConnectionRequests(req.user.id);
	res.status(200).json({
		success: true,
		message: "Incoming requests",
		data: result,
	});
};
export const listOutgoingConnectionRequestsController = async (req, res) => {
	const result = await listOutgoingConnectionRequests(req.user.id);
	res.status(200).json({
		success: true,
		message: "Outgoing requests",
		data: result,
	});
};

export const listConnectionsController = async (req, res) => {
	const result = await listConnections(req.user.id);
	res.status(200).json({
		success: true,
		message: "Connections",
		data: result,
	});
};
export const deleteConnectionController = async (req, res) => {
	await deleteConnection(
		req.user.id,
		req.params.publicId,
	);
	res.status(200).json({
		success: true,
		message: "Connection deleted",
		data: null,
	});
};
