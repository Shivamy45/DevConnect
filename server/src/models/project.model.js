import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
	{
		publicId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 40,
		},
		description: {
			type: String,
			trim: true,
			maxlength: 500,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		visibility: {
			type: String,
			enum: ["PUBLIC", "PRIVATE", "UNLISTED"],
			default: "PUBLIC",
		},
		skills: [
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
	},
	{ timestamps: true },
);

export default mongoose.model("Project", projectSchema);
