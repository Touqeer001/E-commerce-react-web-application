import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminAuthProvider>
      <App />
      <ToastContainer position="top-right" autoClose={2500} />
    </AdminAuthProvider>
  </BrowserRouter>,
);
