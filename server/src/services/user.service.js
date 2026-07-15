import userModel from "../models/user.model.js";

export const getProfile = async (username) => {
	try {
		const user = await userModel.findOne({ username });
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
		console.log(error.name);
		return {
			status: 500,
			message: "Internal Server Error",
			user: null,
		};
	}
};

export const getUserProfile = async (username) => {
	try {
		const user = await userModel.findOne({ username });

		if (!user) {
			return {
				status: 404,
				message: "User not found",
				user: null,
			};
		}

		const {
			username,
			name,
			profilePicture,
			bio,
			education,
			socials,
			developerType,
		} = user.toObject();

		const publicUser = {
			username,
			name,
			profilePicture,
			bio,
			education,
			socials,
			developerType,
		};
		return {
			status: 200,
			message: "User retrieved successfully",
			user: publicUser,
		};
	} catch (error) {
		console.log(error.name);
		return {
			status: 500,
			message: "Internal Server Error",
			user: null,
		};
	}
};
