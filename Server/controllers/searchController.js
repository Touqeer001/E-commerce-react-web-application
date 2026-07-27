// import products from "../data/products.js";

export const globalSearch = (req, res) => {
  const query = req.query.q?.trim().toLowerCase();

 if (!query) {
  return res.json({
    success: true,
    suggestions: [],
    products: products.slice(0, 8), // ya jitne products dikhane hain
    categories: [],
  });
}

  // Products
  const matchedProducts = products.filter((product) => {
  const name = product.name?.toLowerCase() || "";
  const brand = product.brand?.toLowerCase() || "";
  const category = product.category?.toLowerCase() || "";
  const description = product.description?.toLowerCase() || "";

  return (
    name.includes(query) ||
    brand.includes(query) ||
    category.includes(query) ||
    description.includes(query)
  );
});

  // Suggestions
  const suggestions = [
    ...new Set(
      matchedProducts.map((item) => item.name)
    ),
  ].slice(0, 5);

  // Categories
  const categories = [
    ...new Set(
      matchedProducts.map((item) => item.category)
    ),
  ];

  res.json({
    success: true,
    suggestions,
    products: matchedProducts.slice(0, 8),
    categories,
  });
};