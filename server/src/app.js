import express from "express";
const app = express();

import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


export default app;
