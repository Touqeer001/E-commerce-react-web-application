import pool from "../config/db.js";

// Add Address
export const addAddress = async (req, res) => {
  try {
    const {
      user_id,
      first_name,
      last_name,
      phone,
      city,
      state,
      pincode,
      country,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO addresses
      (user_id, first_name, last_name, phone, city, state, pincode, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        first_name,
        last_name,
        phone,
        city,
        state,
        pincode,
        country,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addressId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Address by User
export const getAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM addresses WHERE user_id = ?",
      [userId]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Address
export const updateAddress = async (req, res) => {
  try {
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

    await pool.query(
      `UPDATE addresses
       SET first_name = ?,
           last_name = ?,
           phone = ?,
           city = ?,
           state = ?,
           pincode = ?,
           country = ?
       WHERE id = ?`,
      [
        first_name,
        last_name,
        phone,
        city,
        state,
        pincode,
        country,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Address updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM addresses WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};