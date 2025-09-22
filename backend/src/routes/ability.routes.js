import { Router } from "express";
import { createAbility, deleteAbility, getAllAbilities, getAbilityById, updateAbility } from '../controllers/ability.controller.js'
import { authenticate } from "../middlewares/authenticationMiddleware.js";
import { authorize } from "../middlewares/authorizationMiddleware.js";

const router = Router();

router.get("/", authenticate, authorize("admin", "user"), getAllAbilities);

router.get("/:abilityId", authenticate, authorize("admin","user"), getAbilityById);

router.post("/", authenticate, authorize("admin"), createAbility);

router.put("/:abilityId", authenticate, authorize("admin"), updateAbility,);

router.delete("/:abilityId", authenticate, authorize("admin"), deleteAbility);

export default router;