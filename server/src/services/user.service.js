import userModel from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const getProfile = async (publicId) => {
	const user = await userModel
		.findOne({ publicId })
		.select(
			"email username name profilePic bio education externalLinks skills wantToLearn developerType",
		)
		.populate("skills.skill wantToLearn.skill");
	if (!user) {
		throw new ApiError(404, "User not found");
	}
	return {
		user,
	};
};

export const getUserProfile = async (username) => {
	const user = await userModel
		.findOne({ username })
		.select(
			"username name profilePic bio education externalLinks skills wantToLearn developerType",
		)
		.populate("skills.skill wantToLearn.skill");

	if (!user) {
		throw new ApiError(404, "User not found");
	}
	return {
		user,
	};
};

export const updateProfile = async (publicId, newData) => {
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
		throw new ApiError(400, "No valid fields provided");
	}

	const user = await userModel.findOneAndUpdate(
		{ publicId },
		{ $set: updateData },
		{ returnDocument: "after", runValidators: true },
	);

	if (!user) {
		throw new ApiError(404, "User not found");
	}
	return {
		user,
	};
};

export const updateUsername = async (publicId, newUsername) => {
	const user = await userModel.findOne({ publicId });
	if (!user) {
		throw new ApiError(404, "User not found");
	}
	newUsername = newUsername.trim().toLowerCase();
	if (user.username === newUsername) {
		throw new ApiError(400, "Username is same as current");
	}
	const alreadyInUse = await userModel.findOne({ username: newUsername });
	if (alreadyInUse) {
		throw new ApiError(400, "Username already exists");
	}
	if (user.usernameLastChangedAt != null) {
		const MS_IN_30_DAYS = 30 * 24 * 60 * 60 * 1000;
		const dbDate = new Date(user.usernameLastChangedAt);
		const canChange = Date.now() - dbDate.getTime() >= MS_IN_30_DAYS;

		if (!canChange) {
			throw new ApiError(
				400,
				"Username cannot be changed before 30 days",
			);
		}
	}
	user.username = newUsername;
	user.usernameLastChangedAt = new Date();
	await user.save();
	return {
		user: {
			username: user.username,
			usernameLastChangedAt: user.usernameLastChangedAt,
		},
	};
};

export const updateAvatar = async (publicId, imageURL, imagePublicId) => {
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
		{ returnDocument: "after", runValidators: true },
	);
	if (!user) {
		throw new ApiError(404, "User not found");
	}
	return {
		user: {
			profilePic: user.profilePic,
		},
	};
};

export const getUserName = async (publicId) => {
	const user = await userModel.findOne({ publicId }).select("name");
	if (!user) {
		throw new ApiError(404, "User not found");
	}
	return {
		user: {
			name: user.name,
		},
	};
};
