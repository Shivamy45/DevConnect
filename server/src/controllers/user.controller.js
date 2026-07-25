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

export const getProfileController = async (req, res, next) => {
	const result = await getProfile(req.user.publicId);

	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const getUserProfileController = async (req, res, next) => {
	const result = await getUserProfile(req.params.username);
	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const updateProfileController = async (req, res, next) => {
	const result = await updateProfile(req.user.publicId, req.body);
	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const updateAvatarController = async (req, res, next) => {
	try {
		const uploadResult = await uploadAvatar(
			req.user.publicId,
			req.file.path,
		);
		if (!uploadResult.avatar) {
			return res.status(uploadResult.status).json({
				message: uploadResult.message,
			});
		}
		const result = await updateAvatar(
			req.user.publicId,
			uploadResult.avatar.secure_url,
			uploadResult.avatar.public_id,
		);

		res.status(result.status).json({
			message: result.message,
			user: result.user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

export const generateAvatarController = async (req, res, next) => {
	try {
		const nameResult = await getUserName(req.user.publicId);
		if (!nameResult.user) {
			return res.status(nameResult.status).json({
				message: nameResult.message,
			});
		}
		const url = await generateDefaultAvatar(nameResult.user.name);
		const uploadResult = await uploadAvatar(req.user.publicId, url);
		if (!uploadResult.avatar) {
			return res.status(uploadResult.status).json({
				message: uploadResult.message,
			});
		}
		const result = await updateAvatar(
			req.user.publicId,
			uploadResult.avatar.secure_url,
			uploadResult.avatar.public_id,
		);

		res.status(result.status).json({
			message: result.message,
			user: result.user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

export const updateUsernameController = async (req, res, next) => {
	const result = await updateUsername(req.user.publicId, req.body.username);
	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};
