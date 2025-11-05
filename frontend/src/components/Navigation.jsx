import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navigation = () => {
  const { logout } = useAuth();
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">Slot Swap</h1>
            <div className="flex space-x-4">
              <Link to="/dashboard" className="px-4 py-2 rounded-lg hover:bg-blue-500">
                Dashboard
              </Link>
              <Link to="/marketplace" className="px-4 py-2 rounded-lg hover:bg-blue-500">
                Marketplace
              </Link>
              <Link to="/requests" className="px-4 py-2 rounded-lg hover:bg-blue-500">
                Requests
              </Link>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
