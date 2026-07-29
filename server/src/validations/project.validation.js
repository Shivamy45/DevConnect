import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

const visibilitySchema = z
	.string()
	.trim()
	.toUpperCase()
	.pipe(z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]));

const statusSchema = z
	.string()
	.trim()
	.toUpperCase()
	.pipe(z.enum(["OPEN", "IN_PROGRESS", "COMPLETED"]));

const externalLinkSchema = z
	.object({
		name: z.string().trim().min(1).max(30),
		url: z.url(),
	})
	.strict();

export const createProjectSchema = z.object({
	body: z
		.object({
			title: z.string().trim().min(3).max(40),
			description: z
				.string()
				.trim()
				.max(500, "Description cannot exceed 500 characters")
				.optional(),
			visibility: visibilitySchema.optional(),
			requiredSkills: z.array(objectIdSchema).max(10).optional(),
			externalLinks: z.array(externalLinkSchema).optional(),
			status: statusSchema.optional(),
			maxMembers: z.number().int().min(1).optional(),
		})
		.strict(),
});

export const updateProjectSchema = z.object({
	body: z
		.object({
			title: z.string().trim().min(3).max(40).optional(),
			description: z
				.string()
				.trim()
				.max(500, "Description cannot exceed 500 characters")
				.optional(),
			visibility: visibilitySchema.optional(),
			requiredSkills: z.array(objectIdSchema).max(10).optional(),
			externalLinks: z.array(externalLinkSchema).optional(),
			status: statusSchema.optional(),
			maxMembers: z.number().int().min(1).optional(),
		})
		.strict(),
});
