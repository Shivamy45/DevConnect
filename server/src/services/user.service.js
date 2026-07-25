import userModel from "../models/user.model.js";

export const getProfile = async (publicId) => {
	try {
		const user = await userModel
			.findOne({ publicId })
			.select(
				"email username name profilePic bio education externalLinks skills wantToLearn developerType",
			)
			.populate("skills.skill wantToLearn.skill");
		if (!user) {
			return {
				status: 404,
				message: "User not found",
				user: null,
			};
		}
		return {
			status: 200,
			message: "Profile fetched successfully",
			user,
		};
	} catch (error) {
		return {
			status: 500,
			message: "Internal Server Error",
			user: null,
		};
	}
};

export const getUserProfile = async (username) => {
	try {
		const user = await userModel
			.findOne({ username })
			.select(
				"username name profilePic bio education externalLinks skills wantToLearn developerType",
			)
			.populate("skills.skill wantToLearn.skill");

		if (!user) {
			return {
				status: 404,
				message: "User not found",
				user: null,
			};
		}
		return {
			status: 200,
			message: "User retrieved successfully",
			user,
		};
	} catch (error) {
		return {
			status: 500,
			message: "Internal Server Error",
			user: null,
		};
	}
};

export const updateProfile = async (publicId, newData) => {
	try {
		const allowedFields = [
			"name",
			"bio",
			"education",
			"developerType",
			"skills",
			"wantToLearn",
			"externalLinks",
		];
		const updateData = {};

		for (const key of allowedFields) {
			if (newData[key] !== undefined) {
				updateData[key] = newData[key];
			}
		}

		if (Object.keys(updateData).length === 0) {
			return {
				status: 400,
				message: "No valid fields provided",
				user: null,
			};
		}

		const user = await userModel.findOneAndUpdate(
			{ publicId },
			{ $set: updateData },
			{ new: true, runValidators: true },
		);

		if (!user) {
			return {
				status: 404,
				message: "User not found",
				user: null,
			};
		}
		return {
			status: 200,
			message: "User profile updated",
			user,
		};
	} catch (error) {
		return {
			status: 500,
			message: "Internal Server Error",
			user: null,
		};
	}
};

export const updateUsername = async (publicId, newUsername) => {
	try {
		const user = await userModel.findOne({ publicId });
		if (!user) {
			return {
				status: 404,
				message: "User not found",
				user: null,
			};
		}
		newUsername = newUsername.trim().toLowerCase();
		if (user.username === newUsername) {
			return {
				status: 400,
				message: "Username is same as current",
				user: null,
			};
		}
		const alreadyInUse = await userModel.findOne({ username: newUsername });
		if (alreadyInUse) {
			return {
				status: 400,
				message: "Username already exists",
				user: null,
			};
		}
		if (user.usernameLastChangedAt != null) {
			const MS_IN_30_DAYS = 30 * 24 * 60 * 60 * 1000;
			const dbDate = new Date(user.usernameLastChangedAt);
			const canChange = Date.now() - dbDate.getTime() >= MS_IN_30_DAYS;

			if (!canChange) {
				return {
					status: 400,
					message: "Username cannot be changed before 30 days",
					user: null,
				};
			}
		}
		user.username = newUsername;
		user.usernameLastChangedAt = new Date();
		await user.save();
		return {
			status: 200,
			message: "Username changed successfully",
			user: {
				username: user.username,
				usernameLastChangedAt: user.usernameLastChangedAt,
			},
		};
	} catch (error) {
		return {
			status: 500,
			message: "Internal Server Error",
			user: null,
		};
	}
};

export const updateAvatar = async (publicId, imageURL, imagePublicId) => {
	try {
		const user = await userModel.findOneAndUpdate(
			{ publicId },
			{
				$set: {
					profilePic: {
						url: imageURL,
						publicId: imagePublicId,
					},
				},
			},
			{ new: true, runValidators: true },
		);
		if (!user) {
			return {
				status: 404,
				message: "User not found",
				user: null,
			};
		}
		return {
			status: 200,
			message: "Profile picture updated successfully",
			user: {
				profilePic: user.profilePic,
			},
		};
	} catch (error) {
		return {
			status: 500,
			message: "Internal Server Error",
			user: null,
		};
	}
};

export const getUserName = async (publicId) => {
	try {
		const user = await userModel.findOne({ publicId }).select("name");
		if (!user) {
			return {
				status: 404,
				message: "User not found",
				user: null,
			};
		}
		return {
			status: 200,
			message: "User's name found",
			user: {
				name: user.name,
			},
		};
	} catch (error) {
		return {
			status: 500,
			message: "Internal Server Error",
			user: null,
		};
	}
};
