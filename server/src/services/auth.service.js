import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import userModel from "../models/user.model.js";

export const loginUser = async (email, password) => {
	const user = await userModel.findOne({ email }).select("+password");
	if (!user) return { status: 401, message: "User Not Found" };

	const match = await bcrypt.compare(password, user.password);
	if (!match)
		return { status: 401, message: "Email or Password is incorrect" };
	const { password: _, ...userWithoutPassword } = user.toObject();
	const token = jwt.sign({ sub: user.publicId }, process.env.SECRET_KEY, {
		expiresIn: "6h",
	});
	return {
		status: 200,
		message: "User logged in",
		user: userWithoutPassword,
		token,
	};
};

export const signupUser = async (userDetails) => {
	const { email, password, name, socials, education, developerType } =
		userDetails;

	const found = await userModel.findOne({ email });
	if (found) return { status: 409, message: "User already registered" };

	const hashPass = await bcrypt.hash(password, 10);

	let baseUsername = name.trim().toLowerCase().split(" ").join("");
	let uniqueUsername = await userModel.findOne({ username: baseUsername });
	let username = baseUsername;
	while (uniqueUsername) {
		username = baseUsername + nanoid(5);
		uniqueUsername = await userModel.findOne({ username });
    }
    
	const publicId = nanoid(12);

	const user = await userModel.create({
		publicId,
		username,
		email,
		password: hashPass,
		name,
		socials,
		education,
		developerType,
	});

	const token = jwt.sign({ sub: user.publicId }, process.env.SECRET_KEY, {
		expiresIn: "6h",
	});

	const { password: _, ...userWithoutPassword } = user.toObject();
	return {
		status: 201,
		message: "Account created",
		token,
		user: userWithoutPassword,
	};
};
