import { useState, useEffect } from 'react';
import { apiCall } from '../api/apiCall';

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
          <div key={slot.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
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

export default Marketplace;