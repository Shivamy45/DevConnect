import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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


export const signupUser = async () => {
    const found = await userModel.findOne({ email });
    if (found) return { status: 401, message: "User already registered" };
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    const user = userModel.create({
        
    })
}