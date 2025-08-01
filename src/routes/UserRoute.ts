import express from "express";
import UserController from "../controllers/UserController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.route("/register").post(UserController.registerUser);
router.route("/login").post(UserController.loginUser);
router
  .route("/")
  .get(authMiddleware.isAuthenticated, UserController.getYourProfile);

export default router;
