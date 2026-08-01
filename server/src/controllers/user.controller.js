import {
	generateDefaultAvatar,
	uploadAvatar,
} from "../services/avatar.service.js";
import {
	getProfile,
	getUserProfile,
	updateProfile,
	updateAvatar,
	updateUsername,
	getUserName,
	listUsersBySearch,
} from "../services/user.service.js";

export const getProfileController = async (req, res) => {
	const result = await getProfile(req.user.publicId);

	res.status(200).json({
		success: true,
		message: "Profile fetched successfully",
		data: {
			user: result.user,
		},
	});
};

export const getUserProfileController = async (req, res) => {
	const result = await getUserProfile(req.params.username);
	res.status(200).json({
		success: true,
		message: "User retrieved successfully",
		data: {
			user: result.user,
		},
	});
};

export const updateProfileController = async (req, res) => {
	const result = await updateProfile(req.user.publicId, req.body);
	res.status(200).json({
		success: true,
		message: "User profile updated",
		data: {
			user: result.user,
		},
	});
};

export const updateAvatarController = async (req, res) => {
	const uploadResult = await uploadAvatar(req.user.publicId, req.file.buffer);
	const result = await updateAvatar(
		req.user.publicId,
		uploadResult.profilePic.url,
		uploadResult.profilePic.publicId,
	);

	res.status(200).json({
		success: true,
		message: "Profile picture updated successfully",
		data: {
			user: result.user,
		},
	});
};

export const generateAvatarController = async (req, res) => {
	const nameResult = await getUserName(req.user.publicId);
	const svgPath = await generateDefaultAvatar(nameResult.user.name);
	const uploadResult = await uploadAvatar(req.user.publicId, svgPath, true);
	const result = await updateAvatar(
		req.user.publicId,
		uploadResult.profilePic.url,
		uploadResult.profilePic.publicId,
	);

	res.status(200).json({
		success: true,
		message: "Profile picture updated successfully",
		data: {
			user: result.user,
		},
	});
};

export const updateUsernameController = async (req, res) => {
	const result = await updateUsername(req.user.publicId, req.body.username);
	res.status(200).json({
		success: true,
		message: "Username changed successfully",
		data: {
			user: result.user,
		},
	});
};

export const searchUsersController = async (req, res) => {
	const result = await listUsersBySearch(req.body);

	res.status(200).json({
		success: true,
		message: "Users fetched successfully",
		data: {
			users: result.users,
			pagination: result.pagination,
		},
	});
};
