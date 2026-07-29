import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
			index: true,
			trim: true,
			required: true,
			lowercase: true,
			min: 3,
			max: 30,
		},
		name: {
			type: String,
			trim: true,
			required: true,
			min: 3,
			max: 50,
		},
		profilePic: {
			publicId: {
				type: String,
				default: "",
			},
			url: {
				type: String,
				default: "",
			},
		},
		bio: {
			type: String,
			trim: true,
			default: "",
			max: 300,
		},
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
		skills: [
			{
				skill: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Skill",
				},
				level: {
					type: String,
					enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
				},
			},
		],
		wantToLearn: [
			{
				skill: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Skill",
				},
				level: {
					type: String,
					enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
				},
			},
		],
		education: {
			college: {
				type: String,
				trim: true,
			},
			fieldOfStudy: {
				type: String,
				trim: true,
			},
			graduationYear: {
				type: Number,
			},
		},
		developerType: {
			type: String,
			enum: ["STUDENT", "PROFESSIONAL", "FREELANCER", "SELF_TAUGHT"],
			default: "STUDENT",
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
