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
} from "../services/user.service.js";

export const getProfileController = async (req, res) => {
	const result = await getProfile(req.user.publicId);

	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const getUserProfileController = async (req, res) => {
	const result = await getUserProfile(req.params.username);
	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const updateProfileController = async (req, res) => {
	const result = await updateProfile(req.user.publicId, req.body);
	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const updateAvatarController = async (req, res) => {
	const uploadResult = await uploadAvatar(req.user.publicId, req.file.path);
	const result = await updateAvatar(
		req.user.publicId,
		uploadResult.avatar.secure_url,
		uploadResult.avatar.public_id,
	);

	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const generateAvatarController = async (req, res) => {
	const nameResult = await getUserName(req.user.publicId);
	const url = await generateDefaultAvatar(nameResult.user.name);
	const uploadResult = await uploadAvatar(req.user.publicId, url);
	const result = await updateAvatar(
		req.user.publicId,
		uploadResult.avatar.secure_url,
		uploadResult.avatar.public_id,
	);

	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const updateUsernameController = async (req, res) => {
	const result = await updateUsername(req.user.publicId, req.body.username);
	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};
