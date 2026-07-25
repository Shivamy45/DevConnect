import { z } from "zod";

export const connectionPublicIdParamSchema = z
	.object({
		params: z
			.object({
				publicId: z
					.string()
					.trim()
					.regex(
						/^CON_[A-Za-z0-9_-]{12}$/,
						"Invalid connection public ID",
					),
			})
			.strict(),
	})
	.strict();

export const userPublicIdParamSchema = z
	.object({
		params: z
			.object({
				publicId: z
					.string()
					.trim()
					.regex(/^USR_[A-Za-z0-9_-]{12}$/, "Invalid user public ID"),
			})
			.strict(),
	})
	.strict();
