import connectionModel from "../models/connection.model.js";
import { nanoid } from "nanoid";
import userModel from "../models/user.model.js";

export const sendRequest = async (senderId, receiverId) => {
	try {
		const receiverExist = await userModel.findOne({ _id: receiverId });
		if (!receiverExist || senderId === receiverId) {
			return {
				status: 400,
				message: "Connection cannot be sent",
				connection: null,
			};
		}

		const alreadyFound = await connectionModel.findOne({
			$or: [
				{ sender: senderId, receiver: receiverId },
				{ receiver: senderId, sender: receiverId },
			],
		});
		if (alreadyFound) {
			if (alreadyFound.status === "accepted") {
				return {
					status: 409,
					message: "Connection already present",
					connection: { status: alreadyFound.status },
				};
			}
			if (alreadyFound.status === "pending") {
				return {
					status: 409,
					message: "Connection still pending",
					connection: { status: alreadyFound.status },
				};
			}
			if (alreadyFound.status === "rejected") {
				return {
					status: 409,
					message: "Connection rejected",
					connection: { status: alreadyFound.status },
				};
			}
			if (alreadyFound.status === "cancelled") {
				alreadyFound.status = "pending";
				await alreadyFound.save();
				return {
					status: 200,
					message: "Connection Request Sent",
					connection: { status: alreadyFound.status },
				};
			}
		}
		const connection = await connectionModel.create({
			publicId: nanoid(12),
			sender: senderId,
			receiver: receiverId,
		});
		return {
			status: 200,
			message: "Connection Request Sent",
			connection: { status: connection.status },
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			message: "Internal Server Error",
			connection: null,
		};
	}
};
export const acceptRequest = async (receiverId, connectionId) => {
	try {
		const connection = await connectionModel.findOne({
			publicId: connectionId,
		});
		if (!connection) {
			return {
				status: 404,
				message: "Connection request not found",
				connection: null,
			};
		}
		if (!connection.receiver.equals(receiverId)) {
			return {
				status: 403,
				message:
					"You are not authorized to accept this connection request.",
				connection: null,
			};
		}
		if (connection.status === "accepted") {
			return {
				status: 409,
				message: "Connection already accepted",
				connection: { status: connection.status },
			};
		}
		if (connection.status === "rejected") {
			return {
				status: 409,
				message: "Connection already rejected",
				connection: { status: connection.status },
			};
		}
		if (connection.status === "cancelled") {
			return {
				status: 409,
				message: "Connection is withdrawn by sender",
				connection: { status: connection.status },
			};
		}
		connection.status = "accepted";
		await connection.save();
		return {
			status: 200,
			message: "Connection request accepted",
			connection: {
				status: connection.status,
			},
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			message: "Internal Server Error",
			connection: null,
		};
	}
};
export const rejectRequest = async (receiverId, connectionId) => {
	try {
		const connection = await connectionModel.findOne({
			publicId: connectionId,
		});
		if (!connection) {
			return {
				status: 404,
				message: "Connection request not found",
				connection: null,
			};
		}
		if (!connection.receiver.equals(receiverId)) {
			return {
				status: 403,
				message:
					"You are not authorized to reject this connection request.",
				connection: null,
			};
		}
		if (connection.status === "accepted") {
			return {
				status: 409,
				message:
					"Connection already accepted. Try to delete the connection",
				connection: { status: connection.status },
			};
		}
		if (connection.status === "rejected") {
			return {
				status: 409,
				message: "Connection already rejected",
				connection: { status: connection.status },
			};
		}
		if (connection.status === "cancelled") {
			return {
				status: 409,
				message: "Connection is withdrawn by sender",
				connection: { status: connection.status },
			};
		}
		connection.status = "rejected";
		await connection.save();
		return {
			status: 200,
			message: "Connection request rejected",
			connection: {
				status: connection.status,
			},
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			message: "Internal Server Error",
			connection: null,
		};
	}
};
export const cancelRequest = async (senderId, connectionId) => {
	try {
		const connection = await connectionModel.findOne({
			publicId: connectionId,
		});
		if (!connection) {
			return {
				status: 404,
				message: "Connection request not found",
				connection: null,
			};
		}
		if (!connection.sender.equals(senderId)) {
			return {
				status: 403,
				message:
					"You are not authorized to cancel this connection request.",
				connection: null,
			};
		}
		if (connection.status === "accepted") {
			return {
				status: 409,
				message:
					"Connection already accepted. Try to delete the connection",
				connection: { status: connection.status },
			};
		}
		if (connection.status === "rejected") {
			return {
				status: 409,
				message: "Connection already rejected",
				connection: { status: connection.status },
			};
		}
		if (connection.status === "cancelled") {
			return {
				status: 409,
				message: "Connection already cancelled",
				connection: { status: connection.status },
			};
		}
		connection.status = "cancelled";
		await connection.save();
		return {
			status: 200,
			message: "Connection request cancelled",
			connection: {
				status: connection.status,
			},
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			message: "Internal Server Error",
			connection: null,
		};
	}
};
export const incomingRequests = async (userId) => {
	try {
		const requests = await connectionModel.find({
			receiver: userId,
			status: "pending",
		});
		return {
			status: 200,
			message: "Incoming requests",
			requests,
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			message: "Internal Server Error",
			requests: null,
		};
	}
};
export const outgoingRequests = async (userId) => {
	try {
		const requests = await connectionModel.find({
			sender: userId,
			status: "pending",
		});
		return {
			status: 200,
			message: "Outgoing requests",
			requests,
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			message: "Internal Server Error",
			requests: null,
		};
	}
};
export const showAllConnection = async (userId) => {
	try {
		const connections = await connectionModel.find({
			$or: [{ sender: userId }, { receiver: userId }],
			status: "accepted",
		});
		return {
			status: 200,
			message: "Connections",
			connections,
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			message: "Internal Server Error",
			connection: null,
		};
	}
};
export const deleteConnection = async (userId, connectionId) => {
	try {
		const connection = await connectionModel.findOne({
			publicId: connectionId,
		});
		if (!connection) {
			return {
				status: 404,
				message: "Connection not found",
			};
		}
		if (
			!(
				connection.receiver.equals(userId) ||
				connection.sender.equals(userId)
			)
		) {
			return {
				status: 403,
				message:
					"You are not authorized to delete this connection request.",
			};
		}
		await connection.deleteOne();
		return {
			status: 200,
			message: "Connection deleted",
		};
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			message: "Internal Server Error",
			connection: null,
		};
	}
};
