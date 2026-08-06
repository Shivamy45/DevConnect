import express from "express";
import cookieParser from "cookie-parser";
import userAgent from "express-useragent";
const app = express();
app.use(cookieParser());
app.use(userAgent.express());

// import indexRoutes from "./routes/index.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import connectionRoutes from "./routes/connection.routes.js";
import projectRoutes from "./routes/project.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import collaborationRequestRoutes from "./routes/collaborationRequest.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/collaboration-requests", collaborationRequestRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/users", userRoutes);


app.use(errorMiddleware);

export default app;
