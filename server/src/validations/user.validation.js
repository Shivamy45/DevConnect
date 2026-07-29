import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

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
						college: z
							.string()
							.trim()
							.min(2)
							.max(100)
							.optional(),
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
								name: z
									.string()
									.trim()
									.min(1)
									.max(50),
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
								skill: objectIdSchema,
								level: z.enum([
									"BEGINNER",
									"INTERMEDIATE",
									"ADVANCED",
								]),
							})
							.strict(),
					)
					.max(30)
					.optional(),
				wantToLearn: z
					.array(
						z
							.object({
								skill: objectIdSchema,
								level: z.enum([
									"BEGINNER",
									"INTERMEDIATE",
									"ADVANCED",
								]),
							})
							.strict(),
					)
					.max(30)
					.optional(),
				developerType: z
					.enum([
						"STUDENT",
						"PROFESSIONAL",
						"FREELANCER",
						"SELF_TAUGHT",
					])
					.optional(),
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
