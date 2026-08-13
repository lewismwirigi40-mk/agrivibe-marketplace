import DriverLayout from '../../../components/DriverLayout';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function DeliveryDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('Assigned');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Sample data - will connect to backend later
  const delivery = {
    id: id || 'DEL-001',
    customer: 'Jane M.',
    phone: '254700000001',
    address: 'DeKUT, Nyeri',
    items: ['Fresh Tomatoes x 2', 'Organic Kale x 1'],
    fee: 'KES 150',
    status: 'Assigned',
    orderId: 'ORD-1234',
  };

  const handleStatusUpdate = (newStatus: string) => {
    setStatus(newStatus);
    setMessage(`Status updated to: ${newStatus}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleVerifyCode = () => {
    if (!code || code.length !== 6) {
      setMessage('⚠️ Please enter a valid 6-digit code');
      return;
    }
    setLoading(true);
    // Will connect to backend later
    setTimeout(() => {
      setLoading(false);
      setMessage('✅ Delivery confirmed! Code verified successfully.');
      setStatus('Delivered');
      setTimeout(() => setMessage(''), 3000);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Assigned': 'bg-yellow-500/30 text-yellow-300',
      'Picked Up': 'bg-blue-500/30 text-blue-300',
      'In Transit': 'bg-purple-500/30 text-purple-300',
      'Delivered': 'bg-green-500/30 text-green-300',
    };
    return colors[status] || 'bg-gray-500/30 text-gray-300';
  };

  return (
    <DriverLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Delivery Details</h1>
          <p className="text-gray-400 mt-1">Order #{delivery.orderId}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
          {delivery.status}
        </span>
      </div>

      {/* Delivery Info */}
      <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Delivery ID</span>
          <span className="text-white font-medium">{delivery.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Customer</span>
          <span className="text-white">{delivery.customer}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Phone</span>
          <span className="text-white">{delivery.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Address</span>
          <span className="text-white">{delivery.address}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Delivery Fee</span>
          <span className="text-yellow-400 font-bold">{delivery.fee}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Items</span>
          <span className="text-white">{delivery.items.join(', ')}</span>
        </div>
      </div>

      {/* Status Update */}
      <div className="mt-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {['Picked Up', 'In Transit', 'Delivered'].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusUpdate(s)}
              disabled={status === 'Delivered'}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                status === s
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              } disabled:opacity-50`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Code Verification */}
      <div className="mt-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">🔑 Verify Delivery Code</h3>
        <p className="text-gray-400 text-sm mb-3">Ask the customer for the 6-digit code</p>
        <div className="flex gap-3">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition text-center text-2xl tracking-widest"
            disabled={status === 'Delivered'}
          />
          <button
            onClick={handleVerifyCode}
            disabled={loading || status === 'Delivered'}
            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
        {message && (
          <div className={`mt-3 p-3 rounded-xl text-sm ${
            message.includes('✅') ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
            message.includes('⚠️') ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
            'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-4">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(delivery.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-semibold transition"
        >
          🗺️ Navigate to Delivery Location
        </a>
      </div>
    </DriverLayout>
  );
}