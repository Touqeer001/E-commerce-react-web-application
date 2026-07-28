import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../../Services/api";
import "./CategoryCards.css";

function CategoryCards() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();

        // MockAPI returns the array directly
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <h2>Shop all</h2>
    <section className="category-section">
      <h2>Shop by Category</h2>

      <div className="category-container">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products`}
            className="category-card"
          >
            <img
              src={category.image}
              alt={category.name}
            />

            <p>{category.name}</p>
          </Link>
        ))}
      </div>
    </section>
    </>
  );
}

export default CategoryCards;