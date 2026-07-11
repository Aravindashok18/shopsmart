import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          ShopEase
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-indigo-600">
            Shop
          </Link>
          <Link to="/cart" className="relative hover:text-indigo-600">
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="hover:text-indigo-600">
                Orders
              </Link>
              {(user.role === 'seller' || user.role === 'admin') && (
                <Link to="/seller" className="hover:text-indigo-600">
                  Seller
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-indigo-600">
                  Admin
                </Link>
              )}
              <span className="text-gray-400">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="text-white bg-gray-800 hover:bg-gray-700 rounded-md px-3 py-1.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/register"
                className="text-white bg-indigo-600 hover:bg-indigo-700 rounded-md px-3 py-1.5"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
