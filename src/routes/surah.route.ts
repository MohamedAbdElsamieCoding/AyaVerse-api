import express from "express";
import { getAllSurahs, getSurah } from "../controllers/surah.controller.js";

const router = express.Router();

router.route("/").get(getAllSurahs);
router.route("/:number").get(getSurah);

export default router;
