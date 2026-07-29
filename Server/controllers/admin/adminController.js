import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../config/db.js";

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"];
const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });
const makeToken = (admin) =>
  jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || "8h" },
  );
const parseList = (value) =>
  Array.isArray(value)
    ? value
    : String(value || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
const transaction = async (work) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const out = await work(conn);
    await conn.commit();
    return out;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return fail(res, 422, "Email and password are required");
    const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [
      email.toLowerCase().trim(),
    ]);
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash)))
      return fail(res, 401, "Invalid email or password");
    if (!admin.is_active)
      return fail(res, 403, "This admin account is inactive");
    res.json({
      success: true,
      token: makeToken(admin),
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (e) {
    next(e);
  }
};
export const me = async (req, res, next) => {
  try {
    const [r] = await db.query(
      "SELECT id,name,email,role,is_active,created_at FROM admins WHERE id=?",
      [req.admin.id],
    );
    if (!r[0]?.is_active) return fail(res, 403, "Account is inactive");
    res.json({ success: true, admin: r[0] });
  } catch (e) {
    next(e);
  }
};
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8)
      return fail(
        res,
        422,
        "A new password of at least 8 characters is required",
      );
    const [r] = await db.query("SELECT password_hash FROM admins WHERE id=?", [
      req.admin.id,
    ]);
    if (!r[0] || !(await bcrypt.compare(currentPassword, r[0].password_hash)))
      return fail(res, 400, "Current password is incorrect");
    await db.query("UPDATE admins SET password_hash=? WHERE id=?", [
      await bcrypt.hash(newPassword, 12),
      req.admin.id,
    ]);
    res.json({ success: true, message: "Password updated" });
  } catch (e) {
    next(e);
  }
};
export const dashboard = async (req, res, next) => {
  try {
    const [
      [products],
      [categories],
      [orders],
      [customers],
      [recentOrders],
      [lowStock],
    ] = await Promise.all([
      db.query("SELECT COUNT(*) total FROM products"),
      db.query("SELECT COUNT(*) total FROM categories"),
      db.query("SELECT COUNT(*) total FROM orders"),
      db.query("SELECT COUNT(*) total FROM users"),
      db.query(
        "SELECT o.id,o.total,o.order_status,o.created_at,u.name customer_name FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT 8",
      ),
      db.query(
        "SELECT p.id,p.name,p.stock,c.name category FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.stock <= 10 ORDER BY p.stock ASC LIMIT 8",
      ),
    ]);
    res.json({
      success: true,
      stats: {
        products: products.total,
        categories: categories.total,
        orders: orders.total,
        customers: customers.total,
      },
      recentOrders,
      lowStock,
    });
  } catch (e) {
    next(e);
  }
};

export const listCategories = async (req, res, next) => {
  try {
    const term = `%${req.query.search || ""}%`;
    const [data] = await db.query(
      "SELECT c.*,COUNT(p.id) product_count FROM categories c LEFT JOIN products p ON p.category_id=c.id WHERE c.name LIKE ? GROUP BY c.id ORDER BY c.name",
      [term],
    );
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
export const createCategory = async (req, res, next) => {
  try {
    const { name, image = null } = req.body;
    if (!name?.trim()) return fail(res, 422, "Category name is required");
    const [r] = await db.query(
      "INSERT INTO categories (name,image) VALUES (?,?)",
      [name.trim(), image || null],
    );
    res.status(201).json({ success: true, id: r.insertId });
  } catch (e) {
    e.code === "ER_DUP_ENTRY"
      ? fail(res, 409, "Category already exists")
      : next(e);
  }
};
export const updateCategory = async (req, res, next) => {
  try {
    const { name, image = null } = req.body;
    if (!name?.trim()) return fail(res, 422, "Category name is required");
    const [r] = await db.query(
      "UPDATE categories SET name=?,image=? WHERE id=?",
      [name.trim(), image || null, req.params.id],
    );
    r.affectedRows
      ? res.json({ success: true })
      : fail(res, 404, "Category not found");
  } catch (e) {
    next(e);
  }
};
export const deleteCategory = async (req, res, next) => {
  try {
    const [r] = await db.query("DELETE FROM categories WHERE id=?", [
      req.params.id,
    ]);
    r.affectedRows
      ? res.json({ success: true })
      : fail(res, 404, "Category not found");
  } catch (e) {
    next(e);
  }
};

const saveProduct = async (conn, body, files, id) => {
  const {
    name,
    description = "",
    price,
    category_id = null,
    stock = 0,
    sub_category = null,
    age_group = null,
  } = body;
  if (!name?.trim() || Number(price) < 0 || Number(stock) < 0) {
    const e = new Error("Name, non-negative price and stock are required");
    e.status = 422;
    throw e;
  }
  let productId = id;
  if (id)
    await conn.query(
      "UPDATE products SET name=?,description=?,price=?,category_id=?,stock=?,sub_category=?,age_group=? WHERE id=?",
      [
        name.trim(),
        description,
        price,
        category_id || null,
        stock,
        sub_category || null,
        age_group || null,
        id,
      ],
    );
  else {
    const [r] = await conn.query(
      "INSERT INTO products (name,description,price,category_id,stock,sub_category,age_group) VALUES (?,?,?,?,?,?,?)",
      [
        name.trim(),
        description,
        price,
        category_id || null,
        stock,
        sub_category || null,
        age_group || null,
      ],
    );
    productId = r.insertId;
  }
  if (id && body.replaceImages === "true")
    await conn.query("DELETE FROM product_images WHERE product_id=?", [id]);
  for (const f of files || [])
    await conn.query(
      "INSERT INTO product_images (product_id,image_url) VALUES (?,?)",
      [productId, `/uploads/products/${f.filename}`],
    );
  return productId;
};
export const listProducts = async (req, res, next) => {
  try {
    const { search = "", categoryId = "" } = req.query;
    const [data] = await db.query(
      `SELECT p.*,c.name category,(SELECT image_url FROM product_images WHERE product_id=p.id LIMIT 1) image FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE (p.name LIKE ? OR p.sub_category LIKE ?) AND (?='' OR p.category_id=?) ORDER BY p.id DESC`,
      [`%${search}%`, `%${search}%`, categoryId, categoryId || 0],
    );
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
export const getProduct = async (req, res, next) => {
  try {
    const [[product]] = await db.query("SELECT * FROM products WHERE id=?", [
      req.params.id,
    ]);
    if (!product) return fail(res, 404, "Product not found");
    const [[images], [sizes], [colors]] = await Promise.all([
      db.query("SELECT * FROM product_images WHERE product_id=?", [product.id]),
      db.query("SELECT size FROM product_sizes WHERE product_id=?", [
        product.id,
      ]),
      db.query("SELECT color FROM product_colors WHERE product_id=?", [
        product.id,
      ]),
    ]);
    res.json({
      success: true,
      data: {
        ...product,
        images,
        sizes: sizes.map((x) => x.size),
        colors: colors.map((x) => x.color),
      },
    });
  } catch (e) {
    next(e);
  }
};
export const createProduct = async (req, res, next) => {
  try {
    const id = await transaction((conn) =>
      saveProduct(conn, req.body, req.files),
    );
    res.status(201).json({ success: true, id });
  } catch (e) {
    next(e);
  }
};
export const updateProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [[exists]] = await db.query("SELECT id FROM products WHERE id=?", [
      id,
    ]);
    if (!exists) return fail(res, 404, "Product not found");
    await transaction((conn) => saveProduct(conn, req.body, req.files, id));
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};
export const deleteProduct = async (req, res, next) => {
  try {
    const [r] = await db.query("DELETE FROM products WHERE id=?", [
      req.params.id,
    ]);
    r.affectedRows
      ? res.json({ success: true })
      : fail(res, 404, "Product not found");
  } catch (e) {
    next(e);
  }
};
export const updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    if (!Number.isInteger(Number(stock)) || Number(stock) < 0)
      return fail(res, 422, "Stock must be a non-negative whole number");
    const [r] = await db.query("UPDATE products SET stock=? WHERE id=?", [
      stock,
      req.params.id,
    ]);
    r.affectedRows
      ? res.json({ success: true })
      : fail(res, 404, "Product not found");
  } catch (e) {
    next(e);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const [data] = await db.query(
      "SELECT o.*,u.name customer_name,u.email customer_email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC",
    );
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
export const getOrder = async (req, res, next) => {
  try {
    const [[order]] = await db.query(
      "SELECT o.*,u.name customer_name,u.email customer_email,a.first_name,a.last_name,a.phone,a.city,a.state,a.pincode,a.country FROM orders o JOIN users u ON u.id=o.user_id LEFT JOIN addresses a ON a.id=o.address_id WHERE o.id=?",
      [req.params.id],
    );
    if (!order) return fail(res, 404, "Order not found");
    const [items] = await db.query(
      "SELECT oi.*,p.name,(SELECT image_url FROM product_images WHERE product_id=p.id LIMIT 1) image FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?",
      [order.id],
    );
    res.json({ success: true, data: { ...order, items } });
  } catch (e) {
    next(e);
  }
};
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status))
      return fail(res, 422, "Invalid order status");
    const [r] = await db.query("UPDATE orders SET order_status=? WHERE id=?", [
      status,
      req.params.id,
    ]);
    r.affectedRows
      ? res.json({ success: true })
      : fail(res, 404, "Order not found");
  } catch (e) {
    next(e);
  }
};
export const listCustomers = async (req, res, next) => {
  try {
    const [data] = await db.query(
      "SELECT u.*,COUNT(o.id) order_count,COALESCE(SUM(o.total),0) lifetime_value FROM users u LEFT JOIN orders o ON o.user_id=u.id GROUP BY u.id ORDER BY u.created_at DESC",
    );
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
export const getCustomer = async (req, res, next) => {
  try {
    const [[customer]] = await db.query("SELECT * FROM users WHERE id=?", [
      req.params.id,
    ]);
    if (!customer) return fail(res, 404, "Customer not found");
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC",
      [customer.id],
    );
    res.json({ success: true, data: { ...customer, orders } });
  } catch (e) {
    next(e);
  }
};
