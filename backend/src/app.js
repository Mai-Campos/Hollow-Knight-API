import express from "express";
import authRoutes from "./routes/auth.routes.js";
import characterRoutes from "./routes/character.routes.js";
import abilityRoutes from "./routes/ability.routes.js";
import regionRoutes from "./routes/region.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/abilities", abilityRoutes);
app.use("/api/regions", regionRoutes);


export default app;