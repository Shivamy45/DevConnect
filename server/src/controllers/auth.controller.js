import { loginUser, signupUser } from "../services/auth.service.js";

export const loginController = async (req, res) => {
	const { email, password } = req.body;
	const result = await loginUser(email, password);
	if (result.status === 200) res.cookie("token", result.token);
	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const signUpController = async (req, res) => {
	const { email, password } = req.body;
	const result = await signupUser(email, password);
	if (result.status === 200) res.cookie("token", result.token);
	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};
