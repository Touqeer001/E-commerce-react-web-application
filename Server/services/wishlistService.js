import products from "../data/products.js";
import wishlist from "../data/wishlistData.js";

export const getWishlist = () => ({
  items: wishlist,
  count: wishlist.length,
});

export const addToWishlist = ({ productId }) => {
  const product = products.find((item) => Number(item.id) === Number(productId));

  if (!product) throw new Error("Product not found");
  if (wishlist.some((item) => Number(item.productId) === Number(productId))) {
    throw new Error("Product is already in your wishlist");
  }

  const wishlistItem = {
    wishlistId: Date.now(),
    productId: product.id,
    name: product.name,
    image: product.images?.[0],
    price: product.price,
    color: product.color,
    size: product.size?.[0] || "",
    addedAt: new Date().toISOString(),
  };

  wishlist.push(wishlistItem);
  return wishlistItem;
};

export const removeWishlistItem = (wishlistId) => {
  const index = wishlist.findIndex((item) => item.wishlistId === Number(wishlistId));
  if (index === -1) throw new Error("Wishlist item not found");
  wishlist.splice(index, 1);
};
