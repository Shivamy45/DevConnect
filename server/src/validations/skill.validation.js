import { z } from "zod";

export const searchSkillsSchema = z
	.object({
		query: z
			.object({
				q: z.string().trim().min(1, "Search query is required"),
			})
			.strict(),
	})
	.strict();

export const createSkillSchema = z
	.object({
		body: z
			.object({
				name: z.string().trim().min(1, "Skill name is required"),
			})
			.strict(),
	})
	.strict();
