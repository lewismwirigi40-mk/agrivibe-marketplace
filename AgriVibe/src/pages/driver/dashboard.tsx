import { useState, useEffect } from 'react';
import DriverLayout from '../../components/DriverLayout';
import Link from 'next/link';
import api from '../../services/api';

export default function DriverDashboard() {
  const [todayDeliveries, setTodayDeliveries] = useState<any[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      // Fetch driver's deliveries
      const deliveriesRes = await api.get('/deliveries/my-deliveries');
      const deliveries = deliveriesRes.data.deliveries || [];
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayDel = deliveries.filter((d: any) => 
        d.created_at?.startsWith(today)
      );
      
      setTodayDeliveries(todayDel);
      setCompletedToday(deliveries.filter((d: any) => d.status === 'delivered').length);
      
      // Calculate earnings (delivery fees)
      const earnings = deliveries
        .filter((d: any) => d.status === 'delivered')
        .reduce((sum: number, d: any) => sum + parseFloat(d.delivery_fee || 0), 0);
      setTotalEarnings(earnings);
      
    } catch (error: any) {
      console.error('Failed to fetch driver data:', error);
      setError(error.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'assigned': 'bg-yellow-500/30 text-yellow-300',
      'picked_up': 'bg-blue-500/30 text-blue-300',
      'in_transit': 'bg-purple-500/30 text-purple-300',
      'delivered': 'bg-green-500/30 text-green-300',
      'failed': 'bg-red-500/30 text-red-300',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-500/30 text-gray-300';
  };

  if (loading) {
    return (
      <DriverLayout>
        <div className="text-center text-gray-400 py-12">Loading dashboard...</div>
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
          <h1 className="text-3xl font-bold text-white">Driver Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's your delivery overview</p>
        </div>
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2">
          <span className="text-green-400 font-semibold">✅ {completedToday} Completed</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          { label: 'Today\'s Deliveries', value: todayDeliveries.length, icon: '📦', color: 'bg-blue-500/20 border-blue-500/30' },
          { label: 'Completed', value: completedToday, icon: '✅', color: 'bg-green-500/20 border-green-500/30' },
          { label: 'Total Earnings', value: `KES ${totalEarnings}`, icon: '💰', color: 'bg-yellow-500/20 border-yellow-500/30' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-2xl p-4 backdrop-blur-sm`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Deliveries */}
      <div className="mt-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white">Today's Deliveries</h2>
        {todayDeliveries.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No deliveries assigned for today</p>
        ) : (
          <div className="mt-4 space-y-3">
            {todayDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/5">
                <div>
                  <span className="text-white font-medium">{delivery.id?.slice(0, 8) || 'DEL-001'}</span>
                  <span className="text-gray-400 text-sm ml-3">Order #{delivery.order_id?.slice(0, 8)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(delivery.status)}`}>
                    {delivery.status || 'assigned'}
                  </span>
                  <Link href={`/driver/deliveries/${delivery.id}`} className="text-yellow-400 hover:text-yellow-300 text-sm transition">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DriverLayout>
  );
}