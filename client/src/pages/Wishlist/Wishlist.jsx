import { Link, useNavigate } from "react-router-dom";
import { FaHeartBroken, FaShoppingCart, FaTrash } from "react-icons/fa";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import Loader from "../../components/Loader/Loader";
import "./Wishlist.css";
import { getImageUrl } from "../../utils/imageHelper";

const Wishlist = () => {
  const { wishlist, pageLoading, actionLoading, removeItem } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const moveToCart = async (item) => {
    const added = await addToCart({
      productId: item.productId,
      quantity: 1,
      size: item.size,
      color: item.color,
    });
    if (added) await removeItem(item.wishlistId, false);
  };

  const openProduct = (item) => {
    navigate(`/product/${item.productId}`, {
      state: { product: item.product },
    });
  };

  if (pageLoading) return <Loader />;

  return (
    <main className="wishlist-page">
      <div className="wishlist-container">
        <header className="wishlist-header">
          <div>
            <p>Saved for later</p>
            <h1>
              My Wishlist <span>({wishlist.count})</span>
            </h1>
          </div>
          <Link to="/products">Continue shopping</Link>
        </header>
        {!wishlist.items.length ? (
          <section className="wishlist-empty">
            <FaHeartBroken />
            <h2>Your wishlist is empty</h2>
            <p>Save the styles you love and come back to them anytime.</p>
            <Link to="/products">Explore products</Link>
          </section>
        ) : (
          <section className="wishlist-grid">
            {wishlist.items.map((item) => (
              <article
                className="wishlist-card"
                key={item.wishlistId}
                role="link"
                tabIndex={0}
                onClick={() => openProduct(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ")
                    openProduct(item);
                }}
              >
                <Link
                  to={`/product/${item.productId}`}
                  state={{ product: item.product }}
                  className="wishlist-image"
                >
                  <img src={getImageUrl(item.image)} alt={item.name} />
                </Link>
                <div className="wishlist-content">
                  <h2>{item.name}</h2>
                  <p>{item.color && `Colour: ${item.color}`}</p>
                  <strong>₹{item.price}</strong>
                  <div className="wishlist-actions">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        moveToCart(item);
                      }}
                      disabled={actionLoading}
                    >
                      <FaShoppingCart /> Move to Cart
                    </button>
                    <button
                      className="remove-wishlist"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeItem(item.wishlistId);
                      }}
                      aria-label={`Remove ${item.name}`}
                      disabled={actionLoading}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
