import { z } from "zod";

export const publicIdValueSchema = (prefix, entityName) =>
	z
		.string()
		.trim()
		.regex(
			new RegExp(`^${prefix}[A-Za-z0-9_-]{12}$`),
			`Invalid ${entityName} public ID`,
		);

export const publicIdParamSchema = (prefix, entityName) =>
	z
		.object({
			params: z
				.object({
					publicId: publicIdValueSchema(prefix, entityName),
				})
				.strict(),
		})
		.strict();

export const publicIdSchema = (prefix, entityName) =>
	z
		.object({
			body: z
				.object({
					publicId: publicIdValueSchema(prefix, entityName),
				})
				.strict(),
		})
		.strict();

export const objectIdSchema = z
	.string()
	.regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");
