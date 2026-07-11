import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ street: '', city: '', state: '', postalCode: '', country: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: form,
      });
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return <p className="max-w-md mx-auto px-4 py-12 text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="street"
          required
          placeholder="Street address"
          value={form.street}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          name="city"
          required
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          name="state"
          placeholder="State / Province"
          value={form.state}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          name="postalCode"
          required
          placeholder="Postal code"
          value={form.postalCode}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        <input
          name="country"
          required
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold">Total: ${totalPrice.toFixed(2)}</span>
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-md px-5 py-2 font-medium"
          >
            {submitting ? 'Placing order...' : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  );
}
