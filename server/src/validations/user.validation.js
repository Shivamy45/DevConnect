import { z } from "zod";

export const updateProfileSchema = z
	.object({
		name: z
			.string()
			.trim()
			.regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
			.min(3, "Name must be at least 3 characters")
			.max(50, "Name cannot exceed 50 characters")
			.optional(),
		bio: z.string().max(300, "Bio cannot exceed 300 characters").optional(),
		education: z
			.object({
				college: z.string().trim().min(2).max(100).optional(),
				branch: z.string().trim().min(2).max(50).optional(),
				year: z.number().min(1).max(5).optional(),
			})
			.optional(),
		socials: z
			.object({
				github: z
					.string()
					.url("Please enter a valid GitHub URL")
					.optional(),
				linkedin: z
					.string()
					.url("Please enter a valid LinkedIn URL")
					.optional(),
				portfolio: z
					.string()
					.url("Please enter a valid Portfolio URL")
					.optional(),
			})
			.optional(),
		profilePicture: z.string().url().optional(),
		developerType: z
			.enum(["Student", "Professional", "Freelancer", "Self-Taught"])
			.optional(),
	})
	.strict();

export const updateUsernameSchema = z.object({
	username: z
		.string()
		.trim()
		.regex(
			/^[a-z0-9_-]+$/,
			"Username can only contain letters, numbers, _, and -",
		)
		.min(3, "Username must be at least 3 characters")
		.max(20, "Username cannot exceed 20 characters"),
});
