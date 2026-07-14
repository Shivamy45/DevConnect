import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		publicId: {
			type: String,
			required: true,
			unique: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		bio: {
			type: String,
			trim: true,
			maxlength: 200,
		},
		githubUrl: {
			type: String,
			trim: true,
		},
		location: {
			type: String,
		},
		availability: {
			type: String,
			required: true,
			enum: ["Available", "Busy", "Not Looking"],
		},
		profilePicture: {
			type: String,
		},
	},
	{ timestamps: true },
);

export default mongoose.model("User", userSchema);
