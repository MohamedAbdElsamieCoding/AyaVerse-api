import express from "express";
import {
  addBookmark,
  getMyBookmarks,
  removeBookmark,
} from "../controllers/bookmark.controller.js";
import { protect } from "../middlewares/jwt.js";

const router = express.Router();

router.use(protect);

router.route("/").post(addBookmark).get(getMyBookmarks);
router.route("/:id").delete(removeBookmark);

export default router;
