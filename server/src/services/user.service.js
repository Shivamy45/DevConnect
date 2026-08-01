import userModel from "../models/user.model.js";
import skillModel from "../models/skill.model.js";
import ApiError from "../utils/ApiError.js";

import { resolveSkills } from "./skill.service.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const formatSkill = (skillDetails) => {
	if (!skillDetails?.skill) return null;

	return {
		skill: {
			publicId: skillDetails.skill.publicId,
			name: skillDetails.skill.name,
			category: skillDetails.skill.category,
			icon: skillDetails.skill.icon ?? null,
		},
		level: skillDetails.level,
	};
};

const formatPublicUser = (user) => ({
	publicId: user.publicId,
	username: user.username,
	name: user.name,
	profilePic: user.profilePic,
	bio: user.bio,
	education: user.education,
	externalLinks: user.externalLinks,
	skills: user.skills?.map(formatSkill).filter(Boolean) ?? [],
	wantToLearn: user.wantToLearn?.map(formatSkill).filter(Boolean) ?? [],
	developerType: user.developerType,
});

const resolveSkillPublicIds = async (publicIds) => {
	if (!publicIds?.length) return [];

	const uniquePublicIds = [...new Set(publicIds)];
	const skills = await skillModel
		.find({ publicId: { $in: uniquePublicIds } })
		.select("_id publicId")
		.lean();

	if (skills.length !== uniquePublicIds.length) {
		throw new ApiError(400, "Skill not found");
	}

	const skillIdByPublicId = new Map(
		skills.map((skill) => [skill.publicId, skill._id]),
	);

	return publicIds.map((publicId) => skillIdByPublicId.get(publicId));
};

export const getProfile = async (publicId) => {
	const user = await userModel
		.findOne({ publicId })
		.select(
			"email username name profilePic bio education externalLinks skills wantToLearn developerType",
		)
		.populate("skills.skill wantToLearn.skill");
	if (!user) {
		throw new ApiError(404, "User not found");
	}
	return {
		user,
	};
};

export const getUserProfile = async (username) => {
	const user = await userModel
		.findOne({ username })
		.select(
			"username name profilePic bio education externalLinks skills wantToLearn developerType",
		)
		.populate("skills.skill wantToLearn.skill");

	if (!user) {
		throw new ApiError(404, "User not found");
	}
	return {
		user,
	};
};

export const updateProfile = async (publicId, newData) => {
	const allowedFields = [
		"name",
		"bio",
		"education",
		"developerType",
		"skills",
		"wantToLearn",
		"externalLinks",
	];
	const updateData = {};

	for (const key of allowedFields) {
		if (newData[key] !== undefined) {
			updateData[key] = newData[key];
		}
	}

	if (Object.keys(updateData).length === 0) {
		throw new ApiError(400, "No valid fields provided");
	}

	if (updateData.skills !== undefined) {
		updateData.skills = await resolveSkills(updateData.skills);
	}

	if (updateData.wantToLearn !== undefined) {
		updateData.wantToLearn = await resolveSkills(updateData.wantToLearn);
	}

	const user = await userModel.findOneAndUpdate(
		{ publicId },
		{ $set: updateData },
		{ returnDocument: "after", runValidators: true },
	);

	if (!user) {
		throw new ApiError(404, "User not found");
	}
	return {
		user,
	};
};

export const updateUsername = async (publicId, newUsername) => {
	const user = await userModel.findOne({ publicId });
	if (!user) {
		throw new ApiError(404, "User not found");
	}
	newUsername = newUsername.trim().toLowerCase();
	if (user.username === newUsername) {
		throw new ApiError(400, "Username is same as current");
	}
	const alreadyInUse = await userModel.findOne({ username: newUsername });
	if (alreadyInUse) {
		throw new ApiError(400, "Username already exists");
	}
	if (user.usernameLastChangedAt != null) {
		const MS_IN_30_DAYS = 30 * 24 * 60 * 60 * 1000;
		const dbDate = new Date(user.usernameLastChangedAt);
		const canChange = Date.now() - dbDate.getTime() >= MS_IN_30_DAYS;

		if (!canChange) {
			throw new ApiError(
				400,
				"Username cannot be changed before 30 days",
			);
		}
	}
	user.username = newUsername;
	user.usernameLastChangedAt = new Date();
	await user.save();
	return {
		user: {
			username: user.username,
			usernameLastChangedAt: user.usernameLastChangedAt,
		},
	};
};

export const updateAvatar = async (publicId, imageURL, imagePublicId) => {
	const user = await userModel.findOneAndUpdate(
		{ publicId },
		{
			$set: {
				profilePic: {
					url: imageURL,
					publicId: imagePublicId,
				},
			},
		},
		{ returnDocument: "after", runValidators: true },
	);
	if (!user) {
		throw new ApiError(404, "User not found");
	}
	return {
		user: {
			profilePic: user.profilePic,
		},
	};
};

export const getUserName = async (publicId) => {
	const user = await userModel.findOne({ publicId }).select("name");
	if (!user) {
		throw new ApiError(404, "User not found");
	}
	return {
		user: {
			name: user.name,
		},
	};
};

export const listUsersBySearch = async ({
	q,
	skills,
	levels,
	developerType,
	sort,
	page,
	limit,
}) => {
	const filter = {};

	if (q) {
		const queryRegex = new RegExp(escapeRegex(q), "i");
		filter.$or = [{ username: queryRegex }, { name: queryRegex }];
	}

	if (developerType) {
		filter.developerType = developerType;
	}

	if (skills?.length) {
		const skillObjectIds = await resolveSkillPublicIds(skills);
		filter.$and = skillObjectIds.map((skillId, index) => {
			const skillFilter = { skill: skillId };
			if (levels?.[index]) skillFilter.level = levels[index];

			return {
				skills: {
					$elemMatch: skillFilter,
				},
			};
		});
	}

	const sortOptions = {
		best_match: { username: 1 },
		username_asc: { username: 1 },
		username_desc: { username: -1 },
	};
	const skip = (page - 1) * limit;

	const query = userModel
		.find(filter)
		.select(
			"publicId username name profilePic bio education externalLinks skills wantToLearn developerType -_id",
		)
		.populate({
			path: "skills.skill wantToLearn.skill",
			select: "publicId name category icon -_id",
		})
		.sort(sortOptions[sort])
		.collation({ locale: "en", strength: 2 })
		.skip(skip)
		.limit(limit)
		.lean();

	const [users, total] = await Promise.all([
		query,
		userModel.countDocuments(filter),
	]);

	return {
		users: users.map(formatPublicUser),
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};
