import express from "express";

import authMiddleware from "../middleware/authMiddleware";
import OrganizerProfileController from "../controllers/OrganizerProfileController";

const router = express.Router();

router
  .route("/create")
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.allowTo("ADMIN"),
    OrganizerProfileController.createOrganizerProfile
  );
export default router;
