import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		publicId: {
			type: String,
			required: true,
			unique: true,
			index: true,
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
		username: {
			type: String,
			unique: true,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 30,
		},
		name: {
			type: String,
			trim: true,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		profilePicture: {
			type: String,
			default: "",
		},
		bio: {
			type: String,
			trim: true,
			default: "",
			maxlength: 300,
		},
		socials: {
			github: {
				type: String,
				default: "",
			},
			linkedin: {
				type: String,
				default: "",
			},
			portfolio: {
				type: String,
				default: "",
			},
		},
		education: {
			college: {
				type: String,
				trim: true,
			},
			branch: {
				type: String,
				trim: true,
			},
			year: {
				type: Number,
			},
		},
		developerType: {
			type: String,
			enum: ["Student", "Professional", "Freelancer", "Self-Taught"],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		usernameLastChangedAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true },
);

export default mongoose.model("User", userSchema);
