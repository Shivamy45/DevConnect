import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

export const createProjectSchema = z.object({
	body: z
		.object({
			title: z.string().trim().minLength(3).maxLength(40),
			description: z
				.string()
				.trim()
				.maxLength(300, "Description cannot exceed 300 characters")
				.optional(),
			visibility: z
				.enum(["PUBLIC", "PRIVATE", "UNLISTED"])
				.toUpperCase()
				.optional(),
			skills: z.array(objectIdSchema).max(10).optional(),
			externalLinks: z
				.array(
					z.object({
						name: z.string().trim().minLength(1).maxLength(30),
						url: z.url(),
					}),
				)
				.optional(),
		})
		.strict(),
});

export const updateProjectSchema = z.object({
	body: z
		.object({
			title: z.string().trim().minLength(3).maxLength(40).optional(),
			description: z
				.string()
				.trim()
				.maxLength(300, "Description cannot exceed 300 characters")
				.optional(),
			visibility: z
				.enum(["PUBLIC", "PRIVATE", "UNLISTED"])
				.toUpperCase()
				.optional(),
			skills: z.array(objectIdSchema).max(10).optional(),
			externalLinks: z
				.array(
					z.object({
						name: z.string().trim().minLength(1).maxLength(30),
						url: z.url(),
					}),
				)
				.optional(),
		})
		.strict(),
});
