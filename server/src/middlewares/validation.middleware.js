const requestPartGetters = {
	body: (req) => req.body,
	params: (req) => req.params,
	query: (req) => req.query,
};

const getDefinedRequestParts = (schema) => {
	if (!schema?.shape) {
		throw new TypeError("Validation schema must be a Zod object schema");
	}

	const schemaKeys = Object.keys(schema.shape);
	const unsupportedKeys = schemaKeys.filter((key) => !(key in requestPartGetters));

	if (unsupportedKeys.length) {
		throw new TypeError(
			`Unsupported validation schema keys: ${unsupportedKeys.join(", ")}`,
		);
	}

	return schemaKeys;
};

const validate = (schema) => {
	const requestParts = getDefinedRequestParts(schema);

	return (req, res, next) => {
		const dataToValidate = Object.fromEntries(
			requestParts.map((part) => [part, requestPartGetters[part](req)]),
		);

		const result = schema.safeParse(dataToValidate);
		if (!result.success) return next(result.error);

		for (const part of requestParts) {
			req[part] = result.data[part];
		}

		next();
	};
};
export default validate;
