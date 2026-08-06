import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
	{
		publicId: {
			type: String,
			required: true,
			unique: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			min: 3,
			max: 40,
		},
		description: {
			type: String,
			trim: true,
			max: 500,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
			required: true,
		},
		visibility: {
			type: String,
			enum: ["PUBLIC", "PRIVATE", "UNLISTED"],
			index: true,
			default: "PUBLIC",
		},
		requiredSkills: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Skill",
			},
		],
		externalLinks: [
			{
				name: {
					type: String,
					trim: true,
				},

				url: {
					type: String,
					trim: true,
				},
			},
		],
		coverImage: {
			publicId: String,
			url: String,
		},
		status: {
			type: String,
			enum: ["OPEN", "IN_PROGRESS", "COMPLETED"],
			default: "OPEN",
			index: true,
		},
		maxMembers: {
			type: Number,
			default: 5,
			min: 1,
		},
		members: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				joinedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true },
);

export default mongoose.model("Project", projectSchema);
