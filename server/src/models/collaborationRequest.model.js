import mongoose from "mongoose";

const collaborationRequestSchema = new mongoose.Schema(
	{
		publicId: {
			type: String,
			required: true,
			unique: true,
		},
		projectId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Project",
			required: true,
			index: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		type: {
			type: String,
			enum: ["APPLICATION", "INVITATION"],
			required: true,
			index: true,
		},
		status: {
			type: String,
			enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
			default: "PENDING",
			index: true,
		},
		message: {
			type: String,
			trim: true,
			maxlength: 500,
		},
	},
	{ timestamps: true },
);

export default mongoose.model(
	"CollaborationRequest",
	collaborationRequestSchema,
);
