class ApiError extends Error {
	constructor(statusCode, message) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode || 500;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

export default ApiError;
