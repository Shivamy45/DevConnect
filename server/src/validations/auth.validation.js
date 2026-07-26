import { z } from "zod";

export const loginSchema = z
	.object({
		body: z
			.object({
				email: z.string().email("Enter a valid email address"),
				password: z
					.string()
					.minLength(8, "Password must be at least 8 characters long")
					.maxLength(64, "Password cannot exceed 64 characters"),
			})
			.strict(),
	})
	.strict();

export const registerSchema = z
	.object({
		body: z
			.object({
				email: z
					.string()
					.trim()
					.toLowerCase()
					.email("Enter a valid email address"),
				password: z
					.string()
					.minLength(8, "Password must be at least 8 characters long")
					.maxLength(64, "Password cannot exceed 64 characters")
					.regex(/[A-Z]/, "Must contain an uppercase letter")
					.regex(/[a-z]/, "Must contain an lowercase letter")
					.regex(/[0-9]/, "Must contain a number")
					.regex(/[!@#$%^&*]/, "Must contain a special character"),
				name: z
					.string()
					.trim()
					.regex(/^[A-Za-z\s]+$/, "Name should only contain letters")
					.minLength(3, "Name must be at least 3 characters")
					.maxLength(50, "Name cannot exceed 50 characters"),
			})
			.strict(),
	})
	.strict();
