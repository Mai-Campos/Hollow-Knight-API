import { Router } from "express";
import { login, register } from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validateRequest.js';
import { registerValidator } from '../middlewares/validators.js'

const router = Router();

router.post("/register", registerValidator, validate, register);

router.post("/login", login);

export default router;