import { z } from "zod";
import { publicIdValueSchema } from "./common.validation.js";

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

const messageSchema = z
	.string()
	.trim()
	.max(500, "Message cannot exceed 500 characters")
	.optional();

export const applyToProjectSchema = z
	.object({
		body: z
			.object({
				projectPublicId: projectPublicIdSchema,
				message: messageSchema,
			})
			.strict(),
	})
	.strict();

export const inviteToProjectSchema = z
	.object({
		body: z
			.object({
				projectPublicId: projectPublicIdSchema,
				username: usernameSchema,
				message: messageSchema,
			})
			.strict(),
	})
	.strict();

export const collaborationRequestPublicIdParamSchema = z
	.object({
		params: z
			.object({
				publicId: publicIdValueSchema(
					"CRQ_",
					"collaboration request",
				),
			})
			.strict(),
	})
	.strict();
