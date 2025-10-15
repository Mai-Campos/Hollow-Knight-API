import express from "express";
import authRoutes from "./routes/auth.routes.js";
import characterRoutes from "./routes/character.routes.js";
import abilityRoutes from "./routes/ability.routes.js";
import regionRoutes from "./routes/region.routes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(helmet()); // Agrega cabeceras seguras para prevenir ataques.

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin === process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(new Error("No autorizado por CORS"));
      }
    },
    credentials: true, // Permite envío de cookies o headers de autenticación
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/abilities", abilityRoutes);
app.use("/api/regions", regionRoutes);

export default app;
