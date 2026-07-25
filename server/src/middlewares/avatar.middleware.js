const validateAvatarUpload = (req, res, next) => {
	if (!req.file || !req.file?.path) {
		return res.status(400).json({
			message: "Please upload an image",
		});
	}
	next();
};

export default validateAvatarUpload;