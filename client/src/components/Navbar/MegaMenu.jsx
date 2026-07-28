import { Link } from "react-router-dom";
import "./MegaMenu.css";

const MegaMenu = ({ menu }) => {
  if (!menu) return null;

  return (
    <div className="mega-menu">
      <div className="mega-left">
        <h3>Shop By Category</h3>

        {menu.categories.map((item) => (
          <Link key={item.slug} to={`/products`}>
            {item.name}
          </Link>
        ))}
      </div>

      <div className="mega-right">
        {menu.featured.map((item, index) => (
          <div className="mega-card" key={index}>
            <img src={item.image} alt={item.title} />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;