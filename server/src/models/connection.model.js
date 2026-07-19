import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
	{
		publicId: {
			type: String,
			required: true,
			unique: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
			required: true,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "accepted", "rejected", "cancelled"],
			default: "pending",
		},
	},
	{ timestamps: true },
);

export default mongoose.model("Connection", connectionSchema);
