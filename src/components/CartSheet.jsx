import { useContext } from "react";
import { CartContext } from "../content/CartContent";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function CartSheet() {
  const { cart } = useContext(CartContext);
  return (
    <Link to="/billing">
      <Button>Cart ({cart.length})</Button>
    </Link>
  );
}
