import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import userModel from "../models/user.model.js";
import { generateDefaultAvatar, uploadAvatar } from "./avatar.service.js";
import ApiError from "../utils/ApiError.js";

export const loginUser = async (email, password) => {
	const user = await userModel.findOne({ email }).select("+password");
	if (!user) throw new ApiError(401, "User Not Found");

	const match = await bcrypt.compare(password, user.password);
	if (!match) throw new ApiError(401, "Email or Password is incorrect");
	const { password: _, ...userWithoutPassword } = user.toObject();
	const tokens = generateTokens(user.publicId);
	return {
		status: 200,
		message: "User logged in",
		user: userWithoutPassword,
		tokens,
	};
};

export const registerUser = async (userDetails) => {
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
		try {
			const upload = await uploadAvatar(user.publicId, avatarSvg);
			user.profilePic.url = upload.profilePic.url;
			user.profilePic.publicId = upload.profilePic.publicId;
			await user.save();
		} catch (error) {
			console.error(error);
			throw new ApiError(503, "Uploading Avatar failed");
		}
	} catch (error) {
		if (user) await userModel.findOneAndDelete({ publicId: user.publicId });
		throw error;
	}

	const tokens = generateTokens(user.publicId);

	const { password: _, ...userWithoutPassword } = user.toObject();
	return {
		status: 201,
		message: "Account created",
		user: userWithoutPassword,
		tokens,
	};
};

function generateTokens(publicId) {
	const accessToken = jwt.sign({ sub: publicId }, process.env.SECRET_KEY, {
		expiresIn: "15m",
	});
	const refreshToken = jwt.sign({ sub: publicId }, process.env.SECRET_KEY, {
		expiresIn: "30d",
	});
	return { accessToken, refreshToken };
}

export const refreshToken = async (jwtToken) => {
	if (!jwtToken) {
		throw new ApiError(401, "No refresh token found");
	}
	const refreshToken = jwt.verify(jwtToken, process.env.SECRET_KEY);
	const accessToken = jwt.sign(
		{ sub: refreshToken.sub },
		process.env.SECRET_KEY,
		{
			expiresIn: "15m",
		},
	);
	return {
		status: 200,
		message: "Access token generated",
		tokens: { accessToken },
	};
};
