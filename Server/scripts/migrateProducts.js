import db from "../config/db.js";
import products from "../data/products.js";

const migrateProducts = async () => {
  try {
    console.log("Migration Started...");

    const categoryMap = {};

    // Insert Categories
    for (const product of products) {
      if (!categoryMap[product.category]) {
        const [result] = await db.query(
          "INSERT INTO categories(name) VALUES(?)",
          [product.category]
        );

        categoryMap[product.category] = result.insertId;
      }
    }

    console.log("Categories Imported");

    // Insert Products
    for (const product of products) {
      const categoryId = categoryMap[product.category];

      const [productResult] = await db.query(
        `
        INSERT INTO products
        (
            name,
            description,
            price,
            category_id,
            stock,
            rating,
            sub_category,
            age_group
        )
        VALUES(?,?,?,?,?,?,?,?)
        `,
        [
          product.name,
          "",
          product.price,
          categoryId,
          100,
          product.rating,
          product.subCategory,
          product.ageGroup,
        ]
      );

      const productId = productResult.insertId;

      // Images
      if (product.images) {
        for (const image of product.images) {
          await db.query(
            `
            INSERT INTO product_images
            (product_id,image_url)
            VALUES(?,?)
            `,
            [productId, image]
          );
        }
      }

      // Single Image
      if (product.image) {
        await db.query(
          `
          INSERT INTO product_images
          (product_id,image_url)
          VALUES(?,?)
          `,
          [productId, product.image]
        );
      }

      // Sizes
      if (product.size) {
        for (const size of product.size) {
          await db.query(
            `
            INSERT INTO product_sizes
            (product_id,size)
            VALUES(?,?)
            `,
            [productId, size]
          );
        }
      }

      // Colors
      if (product.colors) {
        for (const color of product.colors) {
          await db.query(
            `
            INSERT INTO product_colors
            (product_id,color)
            VALUES(?,?)
            `,
            [productId, color]
          );
        }
      }

      if (product.color) {
        await db.query(
          `
          INSERT INTO product_colors
          (product_id,color)
          VALUES(?,?)
          `,
          [productId, product.color]
        );
      }
    }

    console.log("Products Imported Successfully");

    process.exit();
  } catch (err) {
    console.log(err);
  }
};

migrateProducts();