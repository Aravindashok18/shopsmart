import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => setError('Order not found.'));
  }, [id]);

  if (error) return <p className="max-w-3xl mx-auto px-4 py-8 text-red-500">{error}</p>;
  if (!order) return <p className="max-w-3xl mx-auto px-4 py-8 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Order #{order._id.slice(-8)}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Placed on {new Date(order.createdAt).toLocaleString()} &middot; Status:{' '}
        <span className="font-medium capitalize">{order.status}</span>
      </p>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {order.items.map((item) => (
          <div key={item.product} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} x ${item.price.toFixed(2)}
              </p>
            </div>
            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Shipping address</h2>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.street}, {order.shippingAddress.city}
            {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}{' '}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>
        <div className="text-sm text-right space-y-1">
          <p>Items: ${order.itemsPrice.toFixed(2)}</p>
          <p>Shipping: ${order.shippingPrice.toFixed(2)}</p>
          <p className="font-semibold text-base">Total: ${order.totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
