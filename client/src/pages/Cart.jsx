import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-indigo-600 font-medium hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  const goToCheckout = () => {
    navigate(user ? '/checkout' : '/login?redirect=/checkout');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
              {item.image && <img src={item.image} alt={item.name} className="object-cover w-full h-full" />}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
            </div>
            <input
              type="number"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.product, Math.max(1, Number(e.target.value)))}
              className="w-16 border border-gray-300 rounded-md px-2 py-1"
            />
            <p className="w-20 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            <button
              onClick={() => removeItem(item.product)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8 border-t border-gray-200 pt-6">
        <span className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</span>
        <button
          onClick={goToCheckout}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6 py-2.5 font-medium"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
