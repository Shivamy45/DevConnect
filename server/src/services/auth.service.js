import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import userModel from "../models/user.model.js";
import { generateDefaultAvatar, uploadAvatar, deleteAvatar } from "./avatar.service.js";
import ApiError from "../utils/ApiError.js";

export const loginUser = async (email, password, deviceInfo) => {
	const user = await userModel.findOne({ email }).select("+password");
	if (!user) throw new ApiError(401, "User Not Found");

	const match = await bcrypt.compare(password, user.password);
	if (!match) throw new ApiError(401, "Email or Password is incorrect");
	const { password: _, ...userWithoutPassword } = user.toObject();
	await user.updateOne({
		$pull: { refreshTokens: { expiresAt: { $lt: new Date() } } },
	});
	const tokens = await generateTokens(user, deviceInfo);
	return {
		status: 200,
		message: "User logged in",
		user: userWithoutPassword,
		tokens,
	};
};

export const registerUser = async (userDetails, deviceInfo) => {
	const { email, password, name, socials, education, developerType } =
		userDetails;

	const found = await userModel.findOne({ email });
	if (found) throw new ApiError(409, "User already registered");

	const hashPass = await bcrypt.hash(password, 10);

	let baseUsername = name.trim().toLowerCase().split(" ").join("");
	let uniqueUsername = await userModel.findOne({ username: baseUsername });
	let username = baseUsername;
	while (uniqueUsername) {
		username = baseUsername + nanoid(5);
		uniqueUsername = await userModel.findOne({ username });
	}

	let user;
	try {
		user = await userModel.create({
			publicId: "USR_" + nanoid(12),
			username,
			email,
			password: hashPass,
			name,
			socials,
			education,
			developerType,
		});

		const avatarSvg = generateDefaultAvatar(user.name);
		let upload;
		try {
			upload = await uploadAvatar(user.publicId, avatarSvg);
			user.profilePic.url = upload.profilePic.url;
			user.profilePic.publicId = upload.profilePic.publicId;
			await user.save();
		} catch (error) {
			console.error(error);
			if (upload) await deleteAvatar(upload.publicId);
			throw new ApiError(503, "Uploading Avatar failed");
		}
	} catch (error) {
		if (user) await userModel.findOneAndDelete({ publicId: user.publicId });
		throw error;
	}

	const tokens = await generateTokens(user, deviceInfo);

	const { password: _, ...userWithoutPassword } = user.toObject();
	return {
		status: 201,
		message: "Account created",
		user: userWithoutPassword,
		tokens,
	};
};

const generateTokens = async (user, deviceInfo) => {
	const accessToken = generateAccessToken(user);
	const refreshToken = await generateRefreshToken(user, deviceInfo);
	return { accessToken, refreshToken };
};

const generateRefreshToken = async (user, deviceInfo) => {
	const refreshToken = jwt.sign(
		{ sub: user.publicId },
		process.env.REFRESH_SECRET_KEY,
		{
			expiresIn: "30d",
		},
	);

	const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 30);

	const refreshTokenObj = {
		tokenHash: hashedRefreshToken,
		expiresAt: expirationDate,
		deviceInfo,
	};
	await user.updateOne({ $addToSet: { refreshTokens: refreshTokenObj } });

	return refreshToken;
};

const generateAccessToken = (user) => {
	return jwt.sign({ sub: user.publicId }, process.env.ACCESS_SECRET_KEY, {
		expiresIn: "15m",
	});
};

export const refreshToken = async (jwtToken, deviceInfo) => {
	if (!jwtToken) throw new ApiError(401, "No refresh token found");
	const payload = jwt.verify(jwtToken, process.env.REFRESH_SECRET_KEY);

	const user = await userModel.findOne({ publicId: payload.sub });

	if (!user) throw new ApiError(404, "User not found");

	let found = false;
	for (const tokenObj of user.refreshTokens) {
		const match = await bcrypt.compare(jwtToken, tokenObj.tokenHash);

		if (match) {
			await user.updateOne({
				$pull: { refreshTokens: tokenObj },
			});
			if (tokenObj.expiresAt <= new Date()) continue;
			found = true;
			break;
		}
	}
	if (!found) {
		throw new ApiError(401, "Unauthorized");
	}

	const tokens = await generateTokens(user, deviceInfo);
	return {
		status: 200,
		message: "Tokens generated",
		tokens,
	};
};

export const logoutUser = async (jwtToken) => {
	if (!jwtToken) throw new ApiError(401, "No refresh token found");

	const payload = jwt.verify(jwtToken, process.env.REFRESH_SECRET_KEY);

	const user = await userModel
		.findOne({ publicId: payload.sub })
		.select("refreshTokens");

	if (!user) throw new ApiError(404, "User not found");

	for (const tokenObj of user.refreshTokens) {
		const match = await bcrypt.compare(jwtToken, tokenObj.tokenHash);

		if (match) {
			await user.updateOne({
				$pull: { refreshTokens: tokenObj },
			});
			break;
		}
	}
	return {
		status: 200,
		message: "Logged Out successfully",
	};
};
