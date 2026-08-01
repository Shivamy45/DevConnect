import { z } from "zod";
import { publicIdValueSchema } from "./common.validation.js";

const skillPublicIdSchema = publicIdValueSchema("SKL_", "skill");

const commaSeparatedSchema = (itemSchema, fieldName) =>
	z
		.string()
		.trim()
		.min(1, `${fieldName} cannot be empty`)
		.transform((value) => value.split(",").map((item) => item.trim()))
		.pipe(z.array(itemSchema).min(1, `${fieldName} cannot be empty`));

const pageSchema = z.coerce.number().int().min(1).default(1);
const limitSchema = z.coerce.number().int().min(1).max(50).default(10);

const skillLevelSchema = z
	.string()
	.trim()
	.toUpperCase()
	.pipe(z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]));

const developerTypeSchema = z
	.string()
	.trim()
	.toUpperCase()
	.pipe(
		z.enum(["STUDENT", "PROFESSIONAL", "FREELANCER", "SELF_TAUGHT"]),
	);

export const updateProfileSchema = z
	.object({
		body: z
			.object({
				name: z
					.string()
					.trim()
					.regex(
						/^[A-Za-z\s]+$/,
						"Name can only contain letters and spaces",
					)
					.min(3, "Name must be at least 3 characters")
					.max(50, "Name cannot exceed 50 characters")
					.optional(),
				bio: z
					.string()
					.trim()
					.max(300, "Bio cannot exceed 300 characters")
					.optional(),
				education: z
					.object({
						college: z.string().trim().min(2).max(100).optional(),
						fieldOfStudy: z
							.string()
							.trim()
							.min(2)
							.max(50)
							.optional(),
						graduationYear: z
							.number()
							.min(2026)
							.max(2100)
							.optional(),
					})
					.strict()
					.optional(),
				externalLinks: z
					.array(
						z
							.object({
								name: z.string().trim().min(1).max(50),
								url: z
									.string()
									.trim()
									.url("Please enter a valid URL"),
							})
							.strict(),
					)
					.max(10)
					.optional(),
				skills: z
					.array(
						z
							.object({
								skill: skillPublicIdSchema,
								level: skillLevelSchema,
							})
							.strict(),
					)
					.max(30)
					.optional(),
				wantToLearn: z
					.array(
						z
							.object({
								skill: skillPublicIdSchema,
								level: skillLevelSchema,
							})
							.strict(),
					)
					.max(30)
					.optional(),
				developerType: developerTypeSchema.optional(),
			})
			.strict(),
	})
	.strict();

export const updateUsernameSchema = z
	.object({
		body: z
			.object({
				username: z
					.string()
					.trim()
					.regex(
						/^[a-z0-9_-]+$/,
						"Username can only contain letters, numbers, _, and -",
					)
					.min(3, "Username must be at least 3 characters")
					.max(20, "Username cannot exceed 20 characters"),
			})
			.strict(),
	})
	.strict();

export const searchUsersSchema = z
	.object({
		query: z
			.object({
				q: z.string().trim().min(1).max(50).optional(),
				skills: commaSeparatedSchema(
					skillPublicIdSchema,
					"skills",
				).optional(),
				levels: commaSeparatedSchema(
					z.literal("").or(skillLevelSchema),
					"levels",
				).optional(),
				developerType: developerTypeSchema.optional(),
				sort: z
					.enum(["best_match", "username_asc", "username_desc"])
					.default("best_match"),
				page: pageSchema,
				limit: limitSchema,
			})
			.strict()
			.refine(
				(query) =>
					!query.levels ||
					(query.skills && query.levels.length <= query.skills.length),
				{
					path: ["levels"],
					message: "Levels must correspond to selected skills",
				},
			),
	})
	.strict();
