import { useState, useEffect } from 'react';
import DriverLayout from '../../components/DriverLayout';
import Link from 'next/link';
import api from '../../services/api';

export default function DriverDeliveries() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await api.get('/deliveries/my-deliveries');
      setDeliveries(response.data.deliveries || []);
    } catch (error: any) {
      console.error('Failed to fetch deliveries:', error);
      setError(error.response?.data?.error || 'Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (id: string, status: string) => {
    try {
      await api.put(`/deliveries/${id}/status`, { status });
      await fetchDeliveries();
    } catch (error) {
      alert('Failed to update delivery status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'assigned': 'bg-yellow-500/30 text-yellow-300',
      'picked_up': 'bg-blue-500/30 text-blue-300',
      'in_transit': 'bg-purple-500/30 text-purple-300',
      'delivered': 'bg-green-500/30 text-green-300',
      'failed': 'bg-red-500/30 text-red-300',
      'cancelled': 'bg-gray-500/30 text-gray-300',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-500/30 text-gray-300';
  };

  const filteredDeliveries = filter === 'all' 
    ? deliveries 
    : deliveries.filter(d => d.status === filter);

  if (loading) {
    return (
      <DriverLayout>
        <div className="text-center text-gray-400 py-12">Loading deliveries...</div>
      </DriverLayout>
    );
  }

  if (error) {
    return (
      <DriverLayout>
        <div className="text-center text-red-400 py-12">{error}</div>
      </DriverLayout>
    );
  }

  return (
    <DriverLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">My Deliveries</h1>
          <p className="text-gray-400 mt-1">View all your assigned deliveries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mt-4">
        {['all', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === f
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {filteredDeliveries.length === 0 ? (
        <div className="mt-6 text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-white">No deliveries found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {filteredDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 hover:border-yellow-400/50 transition-all duration-300">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-white font-semibold">#{delivery.id?.slice(0, 8)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(delivery.status)}`}>
                      {delivery.status || 'assigned'}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-1">📍 {delivery.delivery_address || 'Address not set'}</p>
                  <p className="text-gray-400 text-sm">💰 Delivery Fee: KES {delivery.delivery_fee || 0}</p>
                </div>
                <div className="flex gap-2">
                  {delivery.status !== 'delivered' && delivery.status !== 'failed' && (
                    <select
                      value={delivery.status}
                      onChange={(e) => updateDeliveryStatus(delivery.id, e.target.value)}
                      className="bg-white/10 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:border-yellow-400 outline-none transition"
                    >
                      <option value="assigned">Assigned</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  )}
                  <Link href={`/driver/deliveries/${delivery.id}`} className="text-yellow-400 hover:text-yellow-300 text-sm transition">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DriverLayout>
  );
}