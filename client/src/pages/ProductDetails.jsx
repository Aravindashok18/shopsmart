import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setError('Product not found.'));
  }, [id]);

  if (error) return <p className="max-w-4xl mx-auto px-4 py-8 text-red-500">{error}</p>;
  if (!product) return <p className="max-w-4xl mx-auto px-4 py-8 text-gray-500">Loading...</p>;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid sm:grid-cols-2 gap-8">
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        <p className="text-2xl font-semibold text-indigo-600 mt-4">${product.price.toFixed(2)}</p>
        <p className="text-gray-700 mt-4">{product.description}</p>
        <p className="text-sm mt-4 text-gray-500">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        {product.stock > 0 && (
          <div className="flex items-center gap-3 mt-6">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
              className="w-20 border border-gray-300 rounded-md px-2 py-1.5"
            />
            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 font-medium"
            >
              {added ? 'Added!' : 'Add to cart'}
            </button>
          </div>
        )}

        <button onClick={() => navigate(-1)} className="block mt-4 text-sm text-gray-500 hover:underline">
          &larr; Back
        </button>
      </div>
    </div>
  );
}
