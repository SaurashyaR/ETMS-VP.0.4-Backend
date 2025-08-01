import express from "express";

import authMiddleware from "../middleware/authMiddleware";
import OrganizerProfileController from "../controllers/OrganizerProfileController";
import { Roles } from "../types/globalTypes";

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated,
    OrganizerProfileController.createOrganizerProfile
  );

export default router;
