import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authenticateUser = async (req, res, next) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized",
		});
	}
	try {
		const verify = jwt.verify(token, process.env.SECRET_KEY);
		const user = await userModel.findOne({ publicId: verify.sub });

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}
		req.user = user;
		next();
	} catch (error) {
		console.log(error.name);
		return res.status(401).json({
			success: false,
			message: "Unauthorized",
		});
	}
};

export default authenticateUser;
