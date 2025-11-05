import { useState, useEffect } from 'react';
import { apiCall } from '../api/apiCall';

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

export default Dashboard;