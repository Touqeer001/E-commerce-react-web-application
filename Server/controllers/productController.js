// import products from "../data/products.js";
import db from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.rating,
        p.stock,
        p.sub_category AS subCategory,
        p.age_group AS ageGroup,
        c.name AS category
      FROM products p
      LEFT JOIN categories c
      ON p.category_id = c.id
    `);

    for (const product of products) {
      const [images] = await db.query(
        `SELECT image_url FROM product_images WHERE product_id=?`,
        [product.id]
      );

      const [sizes] = await db.query(
        `SELECT size FROM product_sizes WHERE product_id=?`,
        [product.id]
      );

      const [colors] = await db.query(
        `SELECT color FROM product_colors WHERE product_id=?`,
        [product.id]
      );

      product.images = images.map((img) => img.image_url);
      product.size = sizes.map((s) => s.size);
      product.colors = colors.map((c) => c.color);
    }

    res.json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Product By ID
// export const getProductById = async (req, res) => {
//     try {
//         const id = Number(req.params.id);

//         const product = products.find((item) => item.id === id);

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             product
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Something went wrong",
//             error: error.message
//         });
//     }
// };

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        p.*,
        c.name AS category
      FROM products p
      LEFT JOIN categories c
      ON p.category_id=c.id
      WHERE p.id=?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};





// GET CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = [...new Set(products.map((item) => item.category))];

    res.json({
      success: true,
      total: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SUB CATEGORIES
export const getSubCategories = async (req, res) => {
  try {
    const subCategories = [
      ...new Set(products.map((item) => item.subCategory)),
    ];

    res.json({
      success: true,
      total: subCategories.length,
      subCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET COLORS
export const getColors = async (req, res) => {
  try {
    const colors = [...new Set(products.map((item) => item.color))];

    res.json({
      success: true,
      colors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET AGE GROUPS
export const getAgeGroups = async (req, res) => {
  try {
    const ageGroups = [...new Set(products.map((item) => item.ageGroup))];

    res.json({
      success: true,
      ageGroups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SIZES
export const getSizes = async (req, res) => {
  try {
    const sizes = [...new Set(products.flatMap((item) => item.size))];

    res.json({
      success: true,
      sizes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};