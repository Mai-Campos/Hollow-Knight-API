import { Router } from "express";
import {
  login,
  register,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validateRequest.js";
import { registerValidator } from "../middlewares/validators.js";

const router = Router();

router.post("/register", registerValidator, validate, register);

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", logout);

export default router;
