import express from "express";

import { searchQuran } from "../controllers/search.controller.js";

const router = express.Router();

router.route("/").get(searchQuran);

export default router;
