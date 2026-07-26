import { z } from "zod";
import { objectIdSchema } from "./common.validation";

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
					.minLength(3, "Name must be at least 3 characters")
					.maxLength(50, "Name cannot exceed 50 characters")
					.optional(),
				bio: z
					.string()
					.trim()
					.maxLength(300, "Bio cannot exceed 300 characters")
					.optional(),
				education: z
					.object({
						college: z
							.string()
							.trim()
							.minLength(2)
							.maxLength(100)
							.optional(),
						fieldOfStudy: z
							.string()
							.trim()
							.minLength(2)
							.maxLength(50)
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
									.minLength(1)
									.maxLength(50),
								url: z
									.string()
									.trim()
									.url("Please enter a valid URL"),
							})
							.strict(),
					)
					.maxLength(10)
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
					.maxLength(30)
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
					.maxLength(30)
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
					.minLength(3, "Username must be at least 3 characters")
					.maxLength(20, "Username cannot exceed 20 characters"),
			})
			.strict(),
	})
	.strict();
