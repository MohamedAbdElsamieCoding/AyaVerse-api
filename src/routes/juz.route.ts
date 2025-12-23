import express from "express";
import { getAllJuzs, getJuz } from "../controllers/juz.controller.js";

const router = express.Router();

router.route("/").get(getAllJuzs);
router.route("/:number").get(getJuz);

export default router;
