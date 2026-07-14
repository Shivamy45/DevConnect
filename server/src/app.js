import express from "express";
const app = express();

import indexRoutes from "./routes/index.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
