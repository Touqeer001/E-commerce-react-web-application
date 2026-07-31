import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import  CartProvider  from './context/CartProvider.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import WishlistProvider from './context/WishlistContext/WishlistProvider.jsx';
import TrackingProvider from './context/TrackingProvider.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
   <AuthProvider>
    <CartProvider>
      <WishlistProvider>
       <TrackingProvider>
        <App />
       </TrackingProvider>
      </WishlistProvider>
    </CartProvider>
     <ToastContainer
          position="top-left"
          autoClose={500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />

   </AuthProvider>
  </BrowserRouter>,
)
