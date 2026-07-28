import db from "../config/db.js";


export const globalSearch = async (req, res) => {
  try {
    const query = req.query.q?.trim() || "";

    // Empty search
    if (!query) {
      const [products] = await db.query(`
        SELECT
          p.*,
          c.name AS category,
          MIN(pi.image_url) AS image
        FROM products p
        LEFT JOIN categories c
          ON p.category_id = c.id
        LEFT JOIN product_images pi
          ON p.id = pi.product_id
        GROUP BY p.id
        LIMIT 8
      `);

      return res.json({
        success: true,
        suggestions: [],
        products,
        categories: [],
      });
    }

    const search = `%${query}%`;

    const [products] = await db.query(
      `
     SELECT
    p.*,
    c.name AS category,
    MIN(pi.image_url) AS image,
    GROUP_CONCAT(DISTINCT pc.color) AS colors
FROM products p
LEFT JOIN categories c
    ON p.category_id = c.id
LEFT JOIN product_images pi
    ON p.id = pi.product_id
LEFT JOIN product_colors pc
    ON p.id = pc.product_id
WHERE
    p.name LIKE ?
    OR p.description LIKE ?
    OR p.sub_category LIKE ?
    OR p.age_group LIKE ?
    OR c.name LIKE ?
GROUP BY p.id
LIMIT 8;
      `,
      [search, search, search, search, search]
    );

    // Suggestions
    const [suggestions] = await db.query(
      `
      SELECT DISTINCT p.name
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      WHERE
        p.name LIKE ?
        OR p.description LIKE ?
        OR p.sub_category LIKE ?
        OR p.age_group LIKE ?
        OR c.name LIKE ?
      LIMIT 5
      `,
      [search, search, search, search, search]
    );

    // Categories
    const [categories] = await db.query(
      `
      SELECT DISTINCT c.name
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      WHERE
        p.name LIKE ?
        OR p.description LIKE ?
        OR p.sub_category LIKE ?
        OR p.age_group LIKE ?
        OR c.name LIKE ?
      `,
      [search, search, search, search, search]
    );

    res.json({
      success: true,
      suggestions: suggestions.map((item) => item.name),
      products,
      categories: categories.map((item) => item.name),
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};