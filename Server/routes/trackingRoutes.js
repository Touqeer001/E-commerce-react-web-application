import express from "express";
import { getTracking } from "../controllers/trackingController.js";

const router = express.Router();
router.get("/:orderId", getTracking);
export default router;
