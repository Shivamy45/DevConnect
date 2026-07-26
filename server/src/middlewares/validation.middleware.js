const validate = (schema) => {
	return (req, res, next) => {
		const result = schema.safeParse({
			body: req.body,
			params: req.params,
			query: req.query,
		});
		if (!result.success) return next(result.error);
		req.body = result.data.body;
		req.params = result.data.params;
		req.query = result.data.query;
		next();
	};
};
export default validate;
