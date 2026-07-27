import express from "express";
import { createWishlistItem, deleteWishlistItem, getWishlistItems } from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/", getWishlistItems);
router.post("/", createWishlistItem);
router.delete("/:wishlistId", deleteWishlistItem);

export default router;
