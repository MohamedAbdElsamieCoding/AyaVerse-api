import express from "express";
import {
  getMe,
  login,
  register,
  updateContinueReading,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/jwt.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getme").get(protect, getMe);
router.route("/continue-reading").patch(protect, updateContinueReading);

export default router;
