import { getProfile, getUserProfile } from "../services/user.service.js";

export const getProfileController = async (req, res, next) => {
	const username = req.user.username;
	const result = await getProfile(username);

	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const getUserProfileController = async (req, res, next) => {
	const username = req.params.username;
	const result = await getUserProfile(username);
	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};
