// import products from "../data/products.js";
import cart from "../data/cartData.js";

// Get Cart
import db from "../config/db.js";

export const getCart = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.id AS cartId,
        c.quantity,
        c.size,
        c.color,

        p.id AS productId,
        p.name,
        p.price,

        (
          SELECT image_url
          FROM product_images
          WHERE product_id = p.id
          LIMIT 1
        ) AS image

      FROM cart c
      JOIN products p
      ON c.product_id = p.id
    `);

    res.json(rows);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Add To Cart
export const addToCart = async ({
  productId,
  quantity = 1,
  size,
  color,
}) => {

  const [product] = await db.query(
    `
    SELECT id
    FROM products
    WHERE id = ?
    `,
    [productId]
  );

  if (product.length === 0) {
    throw new Error("Product not found");
  }

  const [existing] = await db.query(
    `
    SELECT *
    FROM cart
    WHERE product_id = ?
      AND size = ?
      AND color = ?
    `,
    [productId, size, color]
  );

  if (existing.length > 0) {

    await db.query(
      `
      UPDATE cart
      SET quantity = quantity + ?
      WHERE id = ?
      `,
      [quantity, existing[0].id]
    );

    return {
      message: "Quantity Updated",
    };
  }

  const [result] = await db.query(
    `
    INSERT INTO cart
    (
      product_id,
      quantity,
      size,
      color
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      productId,
      quantity,
      size,
      color,
    ]
  );

  return {
    cartId: result.insertId,
    productId,
    quantity,
    size,
    color,
  };
};

// Update Quantity
export const updateQuantity = async (cartId, quantity) => {
  await db.query(
    `
    UPDATE cart
    SET quantity = ?
    WHERE id = ?
    `,
    [quantity, cartId]
  );

  return {
    cartId,
    quantity,
  };
};

// Remove Item
export const removeItem = async (cartId) => {
  await db.query(
    `
    DELETE FROM cart
    WHERE id = ?
    `,
    [cartId]
  );

  return true;
};

// Clear Cart
export const clearCart = async () => {
  await db.query(`
    DELETE FROM cart
  `);

  return true;
};
// Cart Summary
export const getCartSummary = async () => {
  const [rows] = await db.query(`
    SELECT
      c.id AS cartId,
      c.quantity,
      c.size,
      c.color,

      p.id AS productId,
      p.name,
      p.price,

      (
        SELECT image_url
        FROM product_images
        WHERE product_id = p.id
        LIMIT 1
      ) AS image

    FROM cart c
    JOIN products p
      ON c.product_id = p.id
  `);

  const subtotal = rows.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const tax = +(subtotal * 0.1).toFixed(2);
  const shipping = subtotal > 0 ? 0 : 0;

  return {
    items: rows,
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
  };
};