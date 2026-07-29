import upload from "../config/multer.js";
import ApiError from "../utils/ApiError.js";
const validateAvatarUpload = (req, res, next) => {
	upload.single("avatar")(req, res, (err) => {
		if (err && err.message === "LIMIT_UNSUPPORTED_TYPE") {
			return next(
				new ApiError(
					400,
					"Only image files (JPEG, PNG, etc.) are allowed",
				),
			);
		}
		if (err) return next(err);
		if (!req.file) {
			return next(new ApiError(400, "Please upload an image"));
		}
		next();
	});
};

export default validateAvatarUpload;
