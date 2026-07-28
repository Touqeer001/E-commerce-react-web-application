// import products from "../data/products.js";
import wishlist from "../data/wishlistData.js";

export const getWishlist = () => ({
  items: wishlist,
  count: wishlist.length,
});

export const addToWishlist = ({ productId, product: selectedProduct }) => {
  if (productId === undefined || productId === null || productId === "") {
    throw new Error("Product ID is required");
  }

  // The UI can use a different mock product feed from the Cart mock catalog.
  // Preserve the selected product and its ID exactly instead of replacing it
  // with a potentially different local product that happens to share an ID.
  const product = selectedProduct || products.find(
    (item) => String(item.id) === String(productId),
  );

  if (!product) throw new Error("Product not found");
  if (wishlist.some((item) => Number(item.productId) === Number(productId))) {
    throw new Error("Product is already in your wishlist");
  }

  const wishlistItem = {
    wishlistId: Date.now(),
    productId,
    name: product.name,
    image: product.images?.[0] || product.image,
    price: product.price,
    color: product.color,
    size: product.size?.[0] || "",
    product,
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
