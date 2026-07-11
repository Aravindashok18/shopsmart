import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', description: '', price: '', category: '', image: '', stock: '' };

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadProducts = () => {
    api.get('/products', { params: { limit: 50 } }).then(({ data }) => {
      setProducts(data.products.filter((p) => p.seller === user._id || p.seller?._id === user._id));
    });
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || '',
      stock: product.stock,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid sm:grid-cols-2 gap-8">
      <div>
        <h1 className="text-xl font-bold mb-4">{editingId ? 'Edit product' : 'New product'}</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            required
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <textarea
            name="description"
            required
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              name="stock"
              type="number"
              min="0"
              required
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <input
            name="category"
            required
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 font-medium"
            >
              {editingId ? 'Save changes' : 'Create product'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-600 border border-gray-300 rounded-md px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Your products</h2>
        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">
                  ${p.price.toFixed(2)} &middot; {p.stock} in stock
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="text-gray-500 text-sm">No products yet.</p>}
        </div>
      </div>
    </div>
  );
}
