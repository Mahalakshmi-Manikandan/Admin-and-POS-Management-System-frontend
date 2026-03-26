import { Button } from "../components/ui/button";

export default function CartPanel({ cart, setCart, onProceed }) {
  const updateQty = (id, qty) => {
    setCart(cart.map(i =>
      i.product_id === id ? { ...i, qty } : i
    ));
  };

  const total = cart.reduce((s, i) => s + i.amount * i.qty, 0);

  return (
    <div className="border rounded p-4 space-y-3">
      <h2 className="font-bold text-lg">Cart</h2>

      {cart.map(i => (
        <div key={i.product_id} className="flex justify-between items-center">
          <span>{i.product_name}</span>
          <input
            type="number"
            value={i.qty}
            min="1"
            className="w-16 border rounded"
            onChange={e => updateQty(i.product_id, +e.target.value)}
          />
        </div>
      ))}

      <div className="font-bold">Total: ₹{total}</div>

      <Button
        className="w-full"
        disabled={cart.length === 0}
        onClick={onProceed}
      >
        Proceed
      </Button>
    </div>
  );
}
