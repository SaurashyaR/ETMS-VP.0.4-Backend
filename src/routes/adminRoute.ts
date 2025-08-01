import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import OrganizerProfileController from "../controllers/OrganizerProfileController";
import { Roles } from "../types/globalTypes";
import adminController from "../controllers/adminController";

const router = express.Router();

router
  .route("/organizer")
  .get(
    authMiddleware.isAuthenticated,
    authMiddleware.allowTo(Roles.ADMIN),
    adminController.getAllOrganizer
  );
router
  .route("/organizer/verify")
  .get(
    authMiddleware.isAuthenticated,
    authMiddleware.allowTo(Roles.ADMIN),
    adminController.getVerifiedOrganizer
  );

router
  .route("/organizer/verify/:organizerId")
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.allowTo(Roles.ADMIN),
    adminController.verifyOrganizer
  );

router
  .route("/organizer/reject/:organizerId")
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.allowTo(Roles.ADMIN),
    adminController.rejectOrganizer
  );

export default router;
