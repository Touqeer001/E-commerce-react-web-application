import pool from "../config/db.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const {
      user_id,
      address_id,
      subtotal,
      tax,
      shipping,
      total,
      payment_status,
      order_status,
      items,
    } = req.body;

    const orderErrors = {};
    if (!user_id) {
      orderErrors.user_id = "User id is required.";
    }
    if (!address_id) {
      orderErrors.address_id = "A valid delivery address is required.";
    }
    if (total === undefined || total === null || isNaN(Number(total))) {
      orderErrors.total = "Order total is required.";
    }
    if (!Array.isArray(items) || items.length === 0) {
      orderErrors.items = "Order items are required.";
    }

    if (Object.keys(orderErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
        errors: orderErrors,
      });
    }

    const [addressRows] = await pool.query(
      "SELECT id FROM addresses WHERE id = ?",
      [address_id]
    );
    if (addressRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Delivery address not found. Please provide a valid delivery address.",
      });
    }

    const [orderResult] = await pool.query(
      `INSERT INTO orders
      (user_id, address_id, subtotal, tax, shipping, total, payment_status, order_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        address_id,
        subtotal,
        tax,
        shipping,
        total,
        payment_status,
        order_status,
      ]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items
        (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)`,
        [
          orderId,
          item.productId,
          item.quantity,
          item.price,
        ]
      );
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Orders
export const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      "SELECT * FROM orders ORDER BY id DESC"
    );

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Order By ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await pool.query(
      `
      SELECT
        o.*,
        a.first_name,
        a.last_name,
    
        a.phone,
        a.city,
        a.state,
        a.pincode,
        a.country
      FROM orders o
      LEFT JOIN addresses a
      ON o.address_id = a.id
      WHERE o.id = ?
      `,
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const [items] = await pool.query(
  `
  SELECT
      oi.id,
      oi.product_id,
      oi.quantity,
      oi.price,

      p.name,

      (
        SELECT image_url
        FROM product_images
        WHERE product_id = p.id
        LIMIT 1
      ) AS image,

      GROUP_CONCAT(DISTINCT ps.size) AS sizes

  FROM order_items oi

  JOIN products p
    ON oi.product_id = p.id

  LEFT JOIN product_sizes ps
    ON ps.product_id = p.id

  WHERE oi.order_id = ?

  GROUP BY oi.id
  `,
  [orderId]
);
    res.status(200).json({
      success: true,
      order: orders[0],
      items,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [orders] = await pool.query(
      `
      SELECT
        o.id,
        o.total,
        o.payment_status,
        o.order_status,
        o.created_at,

        oi.quantity,

        p.name,

        (
          SELECT image_url
          FROM product_images
          WHERE product_id = p.id
          LIMIT 1
        ) AS image

      FROM orders o
      JOIN order_items oi
        ON o.id = oi.order_id
      JOIN products p
        ON oi.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};