import express from "express";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());

// import indexRoutes from "./routes/index.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import connectionRoutes from "./routes/connection.routes.js";
import projectRoutes from "./routes/project.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/connections", connectionRoutes);

app.use("/api/projects", projectRoutes);

app.use(errorMiddleware);

export default app;
