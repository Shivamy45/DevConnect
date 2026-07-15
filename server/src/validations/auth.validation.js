import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Enter a valid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(64, "Password cannot exceed 64 characters"),
});

export const signUpSchema = z
	.object({
		email: z
			.string()
			.trim()
			.toLowerCase()
			.email("Enter a valid email address"),
		password: z
			.string()
			.trim()
			.min(8, "Password must be at least 8 characters long")
			.max(64, "Password cannot exceed 64 characters")
			.regex(/[A-Z]/, "Must contain an uppercase letter")
			.regex(/[0-9]/, "Must contain a number")
			.regex(/[!@#$%^&*]/, "Must contain a special character"),
		name: z
			.string()
			.trim()
			.regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
			.min(3, "Name must be at least 3 characters")
			.max(50, "Name cannot exceed 50 characters"),
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
	})
	.strict();
