import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  getOrdersByUser,
} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Order
router.post("/", requireAuth, createOrder);

// Get all orders
router.get("/", requireAuth, getOrders);

router.get("/user/:userId", getOrdersByUser);
// Get single order
router.get("/:orderId", requireAuth, getOrderById);


export default router;