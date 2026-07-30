import connectionModel from "../models/connection.model.js";
import { nanoid } from "nanoid";
import userModel from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const createConnectionRequest = async (senderId, receiverPublicId) => {
	const receiver = await userModel.findOne({
		publicId: receiverPublicId,
	});
	if (!receiver || senderId.equals(receiver._id)) {
		throw new ApiError(400, "Connection cannot be sent");
	}

	const alreadyFound = await connectionModel.findOne({
		$or: [
			{ sender: senderId, receiver: receiver._id },
			{ receiver: senderId, sender: receiver._id },
		],
	});
	if (alreadyFound) {
		if (alreadyFound.status === "accepted") {
			throw new ApiError(409, "Connection already present");
		}
		if (alreadyFound.status === "pending") {
			throw new ApiError(409, "Connection still pending");
		}
		if (alreadyFound.status === "rejected") {
			throw new ApiError(409, "Connection rejected");
		}
		if (alreadyFound.status === "cancelled") {
			alreadyFound.status = "pending";
			await alreadyFound.save();
			return {
				connection: { status: alreadyFound.status },
			};
		}
	}
	const connection = await connectionModel.create({
		publicId: "CON_" + nanoid(12),
		sender: senderId,
		receiver: receiver._id,
	});
	return {
		connection: { status: connection.status },
	};
};

export const updateConnectionRequestAccepted = async (
	receiverId,
	connectionPublicId,
) => {
	const connection = await connectionModel.findOne({
		publicId: connectionPublicId,
	});
	if (!connection) {
		throw new ApiError(404, "Connection request not found");
	}
	if (!connection.receiver.equals(receiverId)) {
		throw new ApiError(
			403,
			"You are not authorized to accept this connection request.",
		);
	}
	if (connection.status === "accepted") {
		throw new ApiError(409, "Connection already accepted");
	}
	if (connection.status === "rejected") {
		throw new ApiError(409, "Connection already rejected");
	}
	if (connection.status === "cancelled") {
		throw new ApiError(409, "Connection is withdrawn by sender");
	}
	connection.status = "accepted";
	await connection.save();
	return {
		connection: {
			status: connection.status,
		},
	};
};

export const updateConnectionRequestRejected = async (
	receiverId,
	connectionPublicId,
) => {
	const connection = await connectionModel.findOne({
		publicId: connectionPublicId,
	});
	if (!connection) {
		throw new ApiError(404, "Connection request not found");
	}
	if (!connection.receiver.equals(receiverId)) {
		throw new ApiError(
			403,
			"You are not authorized to reject this connection request.",
		);
	}
	if (connection.status === "accepted") {
		throw new ApiError(
			409,
			"Connection already accepted. Try to delete the connection",
		);
	}
	if (connection.status === "rejected") {
		throw new ApiError(409, "Connection already rejected");
	}
	if (connection.status === "cancelled") {
		throw new ApiError(409, "Connection is withdrawn by sender");
	}
	connection.status = "rejected";
	await connection.save();
	return {
		connection: {
			status: connection.status,
		},
	};
};

export const updateConnectionRequestCancelled = async (
	senderId,
	connectionPublicId,
) => {
	const connection = await connectionModel.findOne({
		publicId: connectionPublicId,
	});
	if (!connection) {
		throw new ApiError(404, "Connection request not found");
	}
	if (!connection.sender.equals(senderId)) {
		throw new ApiError(
			403,
			"You are not authorized to cancel this connection request.",
		);
	}
	if (connection.status === "accepted") {
		throw new ApiError(
			409,
			"Connection already accepted. Try to delete the connection",
		);
	}
	if (connection.status === "rejected") {
		throw new ApiError(409, "Connection already rejected");
	}
	if (connection.status === "cancelled") {
		throw new ApiError(409, "Connection already cancelled");
	}
	connection.status = "cancelled";
	await connection.save();
	return {
		connection: {
			status: connection.status,
		},
	};
};

export const listIncomingConnectionRequests = async (userId) => {
	const requests = await connectionModel.find({
		receiver: userId,
		status: "pending",
	});
	return {
		requests,
	};
};

export const listOutgoingConnectionRequests = async (userId) => {
	const requests = await connectionModel.find({
		sender: userId,
		status: "pending",
	});
	return {
		requests,
	};
};

export const listConnections = async (userId) => {
	const connections = await connectionModel.find({
		$or: [{ sender: userId }, { receiver: userId }],
		status: "accepted",
	});
	return {
		connections,
	};
};

export const deleteConnection = async (userId, connectionPublicId) => {
	const connection = await connectionModel.findOne({
		publicId: connectionPublicId,
	});
	if (!connection) {
		throw new ApiError(404, "Connection not found");
	}
	if (
		!(
			connection.receiver.equals(userId) ||
			connection.sender.equals(userId)
		)
	) {
		throw new ApiError(
			403,
			"You are not authorized to delete this connection request.",
		);
	}
	await connection.deleteOne();
	return null;
};
