import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

const isProduction = process.env.NODE_ENV === "production";

const formatZodErrors = (error) =>
	error.issues.map((issue) => ({
		path: issue.path.join("."),
		message: issue.message,
	}));

const formatMongooseValidationErrors = (error) =>
	Object.values(error.errors).map((issue) => ({
		path: issue.path,
		message: issue.message,
	}));

const formatDuplicateKeyErrors = (error) =>
	Object.keys(error.keyValue || {}).map((field) => ({
		path: field,
		message: `${field} already exists`,
	}));

const buildErrorResponse = (err) => {
	if (err instanceof ApiError) {
		return {
			statusCode: err.statusCode,
			message: err.message,
		};
	}

	if (err instanceof mongoose.Error.ValidationError) {
		return {
			statusCode: 400,
			message: "Validation failed",
			errors: formatMongooseValidationErrors(err),
		};
	}

	if (err instanceof mongoose.Error.CastError) {
		return {
			statusCode: 400,
			message: `Invalid ${err.path}`,
			errors: [
				{
					path: err.path,
					message: `${err.value} is not a valid ${err.kind}`,
				},
			],
		};
	}

	if (err?.code === 11000) {
		return {
			statusCode: 409,
			message: "Duplicate field value",
			errors: formatDuplicateKeyErrors(err),
		};
	}

	if (err instanceof jwt.TokenExpiredError) {
		return {
			statusCode: 401,
			message: "Token expired",
		};
	}

	if (err instanceof jwt.JsonWebTokenError) {
		return {
			statusCode: 401,
			message: "Invalid token",
		};
	}

	if (err instanceof ZodError) {
		return {
			statusCode: 400,
			message: "Validation failed",
			errors: formatZodErrors(err),
		};
	}

	return {
		statusCode: 500,
		message: "Internal Server Error",
	};
};

export const errorMiddleware = (err, req, res, next) => {
	if (res.headersSent) return next(err);

	console.error(err);

	const { statusCode, message, errors } = buildErrorResponse(err);
	const response = {
		success: false,
		message,
	};

	if (errors?.length) response.errors = errors;
	if (!isProduction) response.stack = err?.stack;

	return res.status(statusCode).json(response);
};
