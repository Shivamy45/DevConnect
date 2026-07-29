import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";

export const generateDefaultAvatar = (name) => {
	const trimmedName = (name ?? "").trim();
	const initial = (trimmedName ? trimmedName.charAt(0) : "A").toUpperCase();

	const backgroundColor = "#3b82f6";
	const textColor = "#ffffff";
	const size = 200;
	const fontSize = size * 0.55;

	const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <!-- Background shape -->
    <rect width="100%" height="100%" fill="${backgroundColor}" />
    <!-- Centered initial -->
    <text 
    x="50%" 
    y="50%" 
    font-family="Arial, sans-serif" 
    font-size="${fontSize}"
    font-weight="bold" 
    fill="${textColor}" 
    dominant-baseline="central" 
    text-anchor="middle"
    >
    ${initial}
    </text>
    </svg>
    `.trim();

	const base64Svg = Buffer.from(svg).toString("base64");

	const url = `data:image/svg+xml;base64,${base64Svg}`;
	return url;
};

export const uploadAvatar = async (
	publicId,
	avatarBufferOrPath,
	isDefaultAvatar = false,
) => {
	let result;
	if (isDefaultAvatar) {
		result = await cloudinary.uploader.upload(avatarBufferOrPath, {
			folder: "avatars",
			public_id: `ATR_${publicId}`,
			transformation: [{ width: 500, height: 500, crop: "limit" }],
			overwrite: true,
		});
	} else {
		result = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					folder: "avatars",
					transformation: [
						{ width: 500, height: 500, crop: "limit" },
					],
					public_id: `ATR_${publicId}`,
					overwrite: true,
				},
				(error, result) => {
					if (error) return reject(error);
					resolve(result);
				},
			);

			stream.end(avatarBufferOrPath);
		});
	}
	return {
		status: 200,
		message: "Avatar uploaded successfully",
		profilePic: {
			url: result.secure_url,
			publicId: result.public_id,
		},
	};
};

export const deleteAvatar = async (publicId) => {
	const deleted = await cloudinary.uploader.destroy(publicId);
	return {
		status: 200,
		message: "Avatar deleted successfully",
	};
};
