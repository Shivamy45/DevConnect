export const getUsers = (req, res) => {
	res.status(200).json({
		success: true,
		message: "Fetched users successfully",
	});
};
