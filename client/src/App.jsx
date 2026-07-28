import Home from "./pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import ProductListing from "./pages/ProductListing/ProductListing";
import Layout from "./components/Layout/Layout";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Login/Login";
import Checkout from "./pages/Checkout/Checkout";
import AccountProfile from "./pages/Account/AccountProfile";
import AccountOrders from "./pages/Account/AccountOrders";
import OrderDetails from "./pages/Account/OrderDetails";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Loader from "./components/Loader/Loader";
import useCart from "./hooks/useCart";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import ShippingPolicy from "./pages/ShippingPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy"
import  ReturnsExchangePolicy from "./pages/ReturnsExchangePolicy"
import TermsConditions from "./pages/TermsConditions"
import ContactUs from "./pages/ContactUs"
import RaiseReturnRequest from "./pages/RaiseReturnRequest"
import Wishlist from "./pages/Wishlist/Wishlist";

function App() {
  const { actionLoading } = useCart();

  return (
    <>
      {actionLoading && <Loader />}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<ProductListing />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/returns-exchange-policy"
            element={<ReturnsExchangePolicy />}
          />
          <Route
            path="/raise-return-request"
            element={<RaiseReturnRequest />}
          />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders"
            element={
              <ProtectedRoute>
                <AccountOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          <Route  path="/order-success/:orderId" element={<OrderSuccess />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
