import DashboardLayout from '../../components/DashboardLayout';

export default function CustomerDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <p className="text-gray-400 mt-1">Welcome back! Here's your overview</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Total Orders', value: '12', icon: '📦', color: 'bg-blue-500/20 border-blue-500/30' },
          { label: 'Pending Orders', value: '3', icon: '⏳', color: 'bg-yellow-500/20 border-yellow-500/30' },
          { label: 'Wallet Balance', value: 'KES 1,250', icon: '💰', color: 'bg-green-500/20 border-green-500/30' },
          { label: 'Wishlist', value: '8', icon: '❤️', color: 'bg-red-500/20 border-red-500/30' },
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

      {/* Recent Orders */}
      <div className="mt-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
        <div className="mt-4 space-y-3">
          {[
            { id: 'ORD-001', date: '2026-08-05', total: 'KES 450', status: 'Delivered' },
            { id: 'ORD-002', date: '2026-08-04', total: 'KES 320', status: 'Pending' },
            { id: 'ORD-003', date: '2026-08-03', total: 'KES 780', status: 'Processing' },
          ].map((order) => (
            <div key={order.id} className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/5">
              <div>
                <span className="text-white font-medium">{order.id}</span>
                <span className="text-gray-400 text-sm ml-3">{order.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white">{order.total}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'Delivered' ? 'bg-green-500/30 text-green-300' :
                  order.status === 'Pending' ? 'bg-yellow-500/30 text-yellow-300' :
                  'bg-blue-500/30 text-blue-300'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}