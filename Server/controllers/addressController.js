import pool from "../config/db.js";
import { validateDeliveryAddress } from "../middleware/validateDeliveryAddress.js";

// Add Address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      city,
      state,
      pincode,
      country,
    } = req.body;

    const validation = validateDeliveryAddress({
      first_name,
      last_name,
      email,
      phone,
      city,
      state,
      pincode,
      country,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery address",
        errors: validation.errors,
      });
    }

    const [result] = await pool.query(
      `INSERT INTO addresses
      (user_id, first_name, last_name, phone, city, state, pincode, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        first_name,
        last_name,
        phone,
        city,
        state,
        pincode,
        country,
      ]
    );

    console.log(`Address created: id=${result.insertId} user_id=${userId}`);

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addressId: result.insertId,
    });
  } catch (error) {
    console.error("addAddress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message,
    });
  }
};

// Get Addresses for the logged-in user
export const getAddress = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("getAddress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

// Update Address (ownership enforced)
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const { id } = req.params;

    const {
      first_name,
      last_name,
      phone,
      city,
      state,
      pincode,
      country,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE addresses
       SET first_name = ?,
           last_name = ?,
           phone = ?,
           city = ?,
           state = ?,
           pincode = ?,
           country = ?
       WHERE id = ? AND user_id = ?`,
      [
        first_name,
        last_name,
        phone,
        city,
        state,
        pincode,
        country,
        id,
        userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error("updateAddress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

// Delete Address (ownership enforced)
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM addresses WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("deleteAddress error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};
