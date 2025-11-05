import { useState, useEffect, createContext, useContext } from 'react';

// Auth Context
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null;
    } catch {
      return null;
    }
  });

  const login = (newToken) => {
    try {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } catch (e) {
      console.error('Failed to save token', e);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      setToken(null);
    } catch (e) {
      console.error('Failed to remove token', e);
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// API helper function
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`http://localhost:5000/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// Login Component
const Login = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then(r => r.json());
      
      if (data.token) {
        login(data.token);
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Login
          </button>
        </div>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="text-blue-600 hover:underline font-semibold">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

// Signup Component
const Signup = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      setSuccess(true);
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">Account created! Redirecting to login...</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Sign Up
          </button>
        </div>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-purple-600 hover:underline font-semibold">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

// Navigation
const Navigation = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'requests', label: 'Requests' },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">Slot Swap</h1>
            <div className="flex space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
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

// Dashboard Component
const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSlot, setNewSlot] = useState({ title: '', d_Date: '', isSwappable: false });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const data = await apiCall('/my-slots');
      setSlots(data);
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
  };

  const handleCreateSlot = async () => {
    try {
      await apiCall('/add', {
        method: 'POST',
        body: JSON.stringify(newSlot),
      });
      setShowModal(false);
      setNewSlot({ title: '', d_Date: '', isSwappable: false });
      fetchSlots();
    } catch (err) {
      console.error('Error creating slot:', err);
    }
  };

  const toggleSwappable = async (slotId, currentStatus, currentSwappable) => {
    try {
      await apiCall(`/events/${slotId}/update`, {
        method: 'PATCH',
        body: JSON.stringify({
          isSwappable: !currentSwappable,
          status: currentStatus
        }),
      });
      fetchSlots();
    } catch (err) {
      console.error('Error updating slot:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Slots</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Create New Slot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <div key={slot._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{slot.title}</h3>
            <p className="text-gray-600 mb-2">Date: {new Date(slot.d_Date).toLocaleDateString()}</p>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                slot.status === 'Available' ? 'bg-green-100 text-green-800' :
                slot.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {slot.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                slot.isSwappable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {slot.isSwappable ? 'Swappable' : 'Not Swappable'}
              </span>
            </div>
            {slot.status !== 'Pending' && (
              <button
                onClick={() => toggleSwappable(slot._id, slot.status, slot.isSwappable)}
                className={`w-full py-2 rounded-lg transition-colors ${
                  slot.isSwappable
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {slot.isSwappable ? 'Make Not Swappable' : 'Make Swappable'}
              </button>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Create New Slot</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={newSlot.title}
                  onChange={(e) => setNewSlot({ ...newSlot, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Date</label>
                <input
                  type="date"
                  value={newSlot.d_Date}
                  onChange={(e) => setNewSlot({ ...newSlot, d_Date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newSlot.isSwappable}
                  onChange={(e) => setNewSlot({ ...newSlot, isSwappable: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-gray-700 text-sm font-semibold">Make Swappable</label>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleCreateSlot}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Marketplace Component
const Marketplace = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAvailableSlots();
    fetchMySwappableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const data = await apiCall('/swappable-slots');
      setAvailableSlots(data);
    } catch (err) {
      console.error('Error fetching available slots:', err);
    }
  };

  const fetchMySwappableSlots = async () => {
    try {
      const data = await apiCall('/my-swappable');
      setMySwappableSlots(data);
    } catch (err) {
      console.error('Error fetching my swappable slots:', err);
    }
  };

  const handleRequestSwap = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const submitSwapRequest = async (mySlotId) => {
    try {
      await apiCall('/swap-request', {
        method: 'POST',
        body: JSON.stringify({
          user_Slot_Id: mySlotId,
          desired_Slot_Id: selectedSlot._id,
        }),
      });
      setShowModal(false);
      setSelectedSlot(null);
      fetchAvailableSlots();
      fetchMySwappableSlots();
      alert('Swap request sent successfully!');
    } catch (err) {
      console.error('Error sending swap request:', err);
      alert(err.message || 'Failed to send swap request');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Slots</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableSlots.map((slot) => (
          <div key={slot._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{slot.title}</h3>
            <p className="text-gray-600 mb-2">Date: {new Date(slot.d_Date).toLocaleDateString()}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${
              slot.status === 'Available' ? 'bg-green-100 text-green-800' :
              slot.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {slot.status}
            </span>
            <button
              onClick={() => handleRequestSwap(slot)}
              disabled={slot.status === 'Pending'}
              className={`w-full py-2 rounded-lg transition-colors ${
                slot.status === 'Pending'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {slot.status === 'Pending' ? 'Pending' : 'Request Swap'}
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Select Your Slot to Offer</h3>
            <p className="text-gray-600 mb-6">Requesting: {selectedSlot?.title}</p>
            
            {mySwappableSlots.length === 0 ? (
              <p className="text-center text-gray-500 py-8">You don't have any swappable slots. Create one first!</p>
            ) : (
              <div className="space-y-4">
                {mySwappableSlots.map((slot) => (
                  <div key={slot._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800">{slot.title}</h4>
                      <p className="text-sm text-gray-600">Date: {new Date(slot.d_Date).toLocaleDateString()}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                        slot.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {slot.status}
                      </span>
                    </div>
                    <button
                      onClick={() => submitSwapRequest(slot._id)}
                      disabled={slot.status === 'Pending'}
                      className={`px-6 py-2 rounded-lg transition-colors ${
                        slot.status === 'Pending'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      Offer This Slot
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Requests Component
const Requests = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [incomingData, outgoingData] = await Promise.all([
        apiCall('/swaps-received'),
        apiCall('/swaps-sent'),
      ]);
      setIncoming(incomingData);
      setOutgoing(outgoingData);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleResponse = async (requestId, accept) => {
    try {
      await apiCall(`/swap-response/${requestId}`, {
        method: 'POST',
        body: JSON.stringify({ accept }),
      });
      fetchRequests();
      alert(accept ? 'Swap accepted successfully!' : 'Swap rejected');
    } catch (err) {
      console.error('Error responding to swap:', err);
      alert(err.message || 'Failed to respond to swap');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Incoming Requests</h2>
          <div className="space-y-4">
            {incoming.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No incoming requests</p>
            ) : (
              incoming.map((req) => (
                <div key={req._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Offered Slot ID: {req.offeredID}</p>
                    <p className="text-sm text-gray-600">Your Slot ID: {req.receivedID}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                      req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      req.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  {req.status === 'Pending' && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleResponse(req._id, true)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleResponse(req._id, false)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Outgoing Requests</h2>
          <div className="space-y-4">
            {outgoing.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No outgoing requests</p>
            ) : (
              outgoing.map((req) => (
                <div key={req._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Your Slot ID: {req.offeredID}</p>
                    <p className="text-sm text-gray-600">Requested Slot ID: {req.receivedID}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                      req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      req.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return showLogin ? (
      <Login onSwitchToSignup={() => setShowLogin(false)} />
    ) : (
      <Signup onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'marketplace' && <Marketplace />}
      {activeTab === 'requests' && <Requests />}
    </div>
  );
};

// Root Component with Provider
export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}