import { useEffect, useState } from "react";
import { getAllCategories } from "../Services/api";
import "./CategoryCards.css";

function CategoryCards() {

    const [categories, setCategories] = useState([]);

     useEffect(() => {
            const fetchCategories = async () => {
                try {
                    const response = await getAllCategories();
                    setCategories(response.data.data);
                } catch (error) {
                    console.error(error);
                }
            };
    
            fetchCategories();
        }, []);

    return (

        <section className="category-section">

            <h2>Shop by Category</h2>

            <div className="category-container">

                {categories.map(category => (

                    <div className="category-card" key={category.id}>

                        <img
                            src={category.image}
                            alt={category.name}
                        />

                        <p>{category.name}</p>

                    </div>

                ))}

            </div>

        </section>

    );
}

export default CategoryCards;