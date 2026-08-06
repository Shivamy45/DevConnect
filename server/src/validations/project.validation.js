import { z } from "zod";
import { publicIdValueSchema } from "./common.validation.js";

const skillPublicIdSchema = publicIdValueSchema("SKL_", "skill");

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

const projectPublicIdSchema = publicIdValueSchema("PRJ_", "project");

const usernameSchema = z
	.string()
	.trim()
	.regex(
		/^[a-z0-9_-]+$/,
		"Username can only contain letters, numbers, _, and -",
	)
	.min(3, "Username must be at least 3 characters")
	.max(20, "Username cannot exceed 20 characters");

const pageSchema = z.coerce.number().int().min(1).default(1);
const limitSchema = z.coerce.number().int().min(1).max(50).default(10);

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
			requiredSkills: z.array(skillPublicIdSchema).max(10).optional(),
			externalLinks: z.array(externalLinkSchema).optional(),
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
			requiredSkills: z.array(skillPublicIdSchema).max(10).optional(),
			externalLinks: z.array(externalLinkSchema).optional(),
			maxMembers: z.number().int().min(1).optional(),
		})
		.strict(),
});

export const leaveProjectSchema = z
	.object({
		params: z
			.object({
				publicId: projectPublicIdSchema,
			})
			.strict(),
	})
	.strict();

export const removeProjectMemberSchema = z
	.object({
		params: z
			.object({
				publicId: projectPublicIdSchema,
				username: usernameSchema,
			})
			.strict(),
	})
	.strict();

export const completeProjectSchema = z
	.object({
		params: z
			.object({
				publicId: projectPublicIdSchema,
			})
			.strict(),
		body: z
			.object({
				status: z.literal("COMPLETED"),
			})
			.strict(),
	})
	.strict();

export const searchProjectsSchema = z
	.object({
		body: z
			.object({
				q: z.string().trim().min(1).max(40).optional(),
				requiredSkills: z
					.array(
						z.object({
							skill: skillPublicIdSchema,
						}).strict(),
					)
					.optional(),
				status: statusSchema.optional(),
				sort: z
					.enum(["best_match", "newest", "oldest"])
					.default("best_match"),
				page: pageSchema,
				limit: limitSchema,
			})
			.strict(),
	})
	.strict();
