import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

/* ✅ ADD THIS IMPORT */
import { CartProvider } from "./content/CartContent";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* ✅ WRAP APP WITH CART PROVIDER */}
    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>
);
