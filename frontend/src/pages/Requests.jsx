import { useState, useEffect } from 'react';
import { apiCall } from '../api/apiCall';

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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Div For Incoming Requests */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Incoming Requests</h2>
          <div className="space-y-4">
            {incoming.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No incoming requests</p>
            ) : (
              incoming.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Offered by:</span> {req.offered_by}
                    </p>
                    {/* <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Offered Event:</span> {req.offered_event || 'N/A'}
                    </p> */}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Offered Date:</span> {formatDate(req.date_of_offered_event)}
                    </p>
                    {/* <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Your Event:</span> {req.requested_event|| 'N/A'}
                    </p> */}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Your Event Date:</span> {formatDate(req.date_of_requested_event)}
                    </p>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm mt-3 ${
                        req.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : req.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  {req.status === 'Pending' && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleResponse(req.id, true)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleResponse(req.id, false)}
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

        {/* Div for Outgoing Requests */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Outgoing Requests</h2>
          <div className="space-y-4">
            {outgoing.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No outgoing requests</p>
            ) : (
              outgoing.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Sent To:</span> {req.sent_to}
                    </p>
                    {/* <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Your Event:</span> {req.offered_event?.name || 'N/A'}
                    </p> */}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Your Event Date:</span> {formatDate(req.date_of_offered_event)}
                    </p>
                    {/* <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Requested Event:</span> {req.requested_event?.name || 'N/A'}
                    </p> */}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Requested Event Date:</span> {formatDate(req.date_of_requested_event)}
                    </p>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm mt-3 ${
                        req.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : req.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
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

export default Requests;
