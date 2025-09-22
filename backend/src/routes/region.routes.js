import { Router } from "express";
import { createRegion, deleteRegion, getAllRegions, getRegionById, updateRegion } from '../controllers/region.controller.js'
import { authenticate } from "../middlewares/authenticationMiddleware.js";
import { authorize } from "../middlewares/authorizationMiddleware.js";

const router = Router();

router.get("/", authenticate, authorize("admin", "user"), getAllRegions);

router.get("/:regionId", authenticate, authorize("admin", "user"), getRegionById);

router.post("/", authenticate, authorize("admin"), createRegion,);

router.put("/:regionId", authenticate, authorize("admin"), updateRegion);

router.delete("/:regionId", authenticate, authorize("admin"), deleteRegion);


export default router;