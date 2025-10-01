import express from "express";
import authRoutes from "./routes/auth.routes.js";
import characterRoutes from "./routes/character.routes.js";
import abilityRoutes from "./routes/ability.routes.js";
import regionRoutes from "./routes/region.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/abilities", abilityRoutes);
app.use("/api/regions", regionRoutes);

export default app;
