import { addToWishlist, getWishlist, removeWishlistItem } from "../services/wishlistService.js";

export const getWishlistItems = (req, res) => {
  res.status(200).json({ success: true, data: getWishlist() });
};

export const createWishlistItem = (req, res) => {
  try {
    const item = addToWishlist(req.body);
    res.status(201).json({ success: true, message: "Added to wishlist", data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteWishlistItem = (req, res) => {
  try {
    removeWishlistItem(req.params.wishlistId);
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
