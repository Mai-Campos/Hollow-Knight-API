import { Router } from "express";
import { createCharacter, deleteCharacter, getAllCharacters, getCharacterById, updateCharacter } from '../controllers/character.controller.js'
import { authenticate } from "../middlewares/authenticationMiddleware.js";
import { authorize } from "../middlewares/authorizationMiddleware.js";


const router = Router();

router.get("/", authenticate, authorize("admin", "user"), getAllCharacters);

router.get("/:characterId", authenticate, authorize("admin", "user"), getCharacterById);

router.post("/", authenticate, authorize("admin"), createCharacter);

router.put("/:characterId", authenticate, authorize("admin"), updateCharacter);

router.delete("/:characterId", authenticate, authorize("admin"), deleteCharacter);

export default router;