import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
	{
		publicId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		icon: {
			publicId: String,
			url: String,
		},
	},
	{ timestamps: true },
);

export default mongoose.model("Skill", skillSchema);
