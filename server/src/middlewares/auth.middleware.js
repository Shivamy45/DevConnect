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
		const payload = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
		const user = await userModel
			.findOne({ publicId: payload.sub })
			.select("_id publicId username");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}
		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized",
		});
	}
};

export default authenticateUser;
