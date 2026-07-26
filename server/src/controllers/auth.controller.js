import {
	loginUser,
	refreshToken,
	registerUser,
} from "../services/auth.service.js";

export const loginController = async (req, res) => {
	const { email, password } = req.body;

	const result = await loginUser(email, password);

	if (result.tokens.accessToken)
		res.cookie("token", result.tokens.accessToken);
	if (result.tokens.refreshToken) {
		res.cookie("jwt", result.tokens.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: 24 * 60 * 60 * 1000,
		});
	}

	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const registerController = async (req, res) => {
	const userDetails = req.body;

	const result = await registerUser(userDetails);

	if (result.tokens.accessToken)
		res.cookie("token", result.tokens.accessToken);
	if (result.tokens.refreshToken) {
		res.cookie("jwt", result.tokens.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: 24 * 60 * 60 * 1000,
		});
	}
	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};

export const refreshTokenController = async (req, res) => {
	const result = await refreshToken(req.cookies.jwt);
	if (result.tokens.accessToken) {
		res.cookie("token", result.tokens.accessToken);
	}
	res.status(result.status).json({
		message: result.message,
		user: result.user,
	});
};
