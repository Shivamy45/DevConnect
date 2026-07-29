import multer from "multer";
import path from "path";
import ApiError from "../utils/ApiError.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

// File Type Filter (Images only)
const fileFilter = (req, file, cb) => {
	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new ApiError(400, "Only images are allowed!"), false);
	}
};

// Initialize Multer
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 2 * 1024 * 1024 },
	fileFilter: fileFilter,
});

export default upload;
