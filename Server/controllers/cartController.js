import {
  addToCart,
  getCartSummary,
  updateQuantity,
  removeItem,
  clearCart,
} from "../services/cartSerivce.js";

/**
 * GET /cart
 */
export const getCart = async (req, res) => {
  try {
    const cart = await getCartSummary();

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /cart
 */
export const createCartItem = async (req, res) => {
  try {

    const cartItem = await addToCart(req.body);


    res.status(201).json({
      success: true,
      message: "Product added to cart",
      data: cartItem,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * PUT /cart/:cartId
 */
export const updateCartItem = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;

    const updatedItem = await updateQuantity(cartId, quantity);

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: updatedItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE /cart/:cartId
 */
export const deleteCartItem = async (req, res) => {
  try {
    const { cartId } = req.params;

    await removeItem(cartId);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE /cart
 */
export const deleteCart = async (req, res) => {
  try {
    await clearCart();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};