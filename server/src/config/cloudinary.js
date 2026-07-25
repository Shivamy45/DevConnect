import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CL0UDINARY_NAME,
	api_key: process.env.CL0UDINARY_API_KEY,
	api_secret: process.env.CL0UDINARY_API_SECRET,
});

export default cloudinary;