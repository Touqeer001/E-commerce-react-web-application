import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import WishlistContext from "./WishlistContext";
import { addToWishlist as addWishlistAPI, getWishlist, removeWishlistItem } from "../../Services/wishlistService";

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ items: [], count: 0 });
  const [pageLoading, setPageLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const addingRef = useRef(false);

  const fetchWishlist = async () => {
    setPageLoading(true);
    try {
      const response = await getWishlist();
      setWishlist(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load wishlist.");
    } finally { setPageLoading(false); }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const addItem = async (productId) => {
    if (addingRef.current) return false;
    addingRef.current = true;
    setActionLoading(true);
    try {
      const response = await addWishlistAPI(productId);
      await fetchWishlist();
      toast.success(response.data.message || "Added to wishlist.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add to wishlist.");
      return false;
    } finally { addingRef.current = false; setActionLoading(false); }
  };

  const removeItem = async (wishlistId, showToast = true) => {
    setActionLoading(true);
    try {
      const response = await removeWishlistItem(wishlistId);
      await fetchWishlist();
      if (showToast) toast.success(response.data.message || "Removed from wishlist.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to remove item.");
      return false;
    } finally { setActionLoading(false); }
  };

  return <WishlistContext.Provider value={{ wishlist, pageLoading, actionLoading, fetchWishlist, addItem, removeItem }}>{children}</WishlistContext.Provider>;
};

export default WishlistProvider;
