import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDatabase from "./src/db/connect.js";

const startServer = async () => {
	try {
		await connectDatabase();
		console.log(`Database Connected`);

		app.listen(process.env.PORT, () => {
			console.log(
				`Server running at http://localhost:${process.env.PORT}`,
			);
		});
	} catch (error) {
		console.log("Database connection failed");
		process.exit(1);
	}
};

startServer();
