import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controller/settings.controller.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/admin/settings", updateSettings);

export default router;
