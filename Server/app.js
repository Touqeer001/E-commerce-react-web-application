import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import megaMenuRoutes from "./routes/megaMenuRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import pool from "./config/db.js";




// dotenv.config({
//   path: new URL(".env", import.meta.url),
// });
dotenv.config();



try {
  const connection = await pool.getConnection();
  console.log("✅ MySQL Connected Successfully");
  connection.release();
} catch (error) {
  console.error("❌ MySQL Connection Failed:", error.message);
}


console.log("Merchant ID:", process.env.BRAINTREE_MERCHANT_ID);
console.log("Public Key:", process.env.BRAINTREE_PUBLIC_KEY);
console.log("Private Key:", process.env.BRAINTREE_PRIVATE_KEY);

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//product routes

app.use("/mega-menu", megaMenuRoutes);

app.use("/products", productRoutes);

app.use("/banners", bannerRoutes);

app.use("/categories", categoryRoutes);

// cart
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);

// auth
app.use("/auth", authRoutes);

// orders
app.use("/orders", orderRoutes);
app.use("/tracking", trackingRoutes);

app.use("/payment", paymentRoutes);

//search
app.use("/search", searchRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running successfully ",
  });
});






export default app;
