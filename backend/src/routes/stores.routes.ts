import { Router } from "express";
import * as ctl from "../controllers/stores.controller";
import { authMiddleware, requireRoles } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createStoreSchema,
  listStoresSchema,
  updateStoreSchema,
} from "../utils/validation";

export const storesRouter = Router();

storesRouter.get("/", validate(listStoresSchema), ctl.list);
storesRouter.get("/:id", ctl.getOne);

storesRouter.use(authMiddleware);
storesRouter.post(
  "/",
  requireRoles("ADMIN", "OWNER"),
  validate(createStoreSchema),
  ctl.create
);
storesRouter.put(
  "/:id",
  requireRoles("ADMIN", "OWNER"),
  validate(updateStoreSchema),
  ctl.update
);
storesRouter.delete("/:id", requireRoles("ADMIN", "OWNER"), ctl.remove);
