import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-4xl mx-auto pb-16">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📜</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Terms & Conditions</h1>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using AgriVibe Marketplace.
          </p>
          <p className="text-gray-500 text-sm mt-2">Last Updated: August 2026</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">📋 Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By using AgriVibe Marketplace ("we", "our", "us"), you agree to comply with and be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our platform or services.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">👤 User Accounts</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-white font-semibold">Registration</h3>
                <p className="text-gray-300 text-sm">You must register an account to use certain features of our platform. You agree to provide accurate, current, and complete information during registration and to update it as necessary.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">Account Security</h3>
                <p className="text-gray-300 text-sm">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">Account Termination</h3>
                <p className="text-gray-300 text-sm">We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activities, or misuse our platform.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">🛒 Orders & Payments</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-white font-semibold">Order Placement</h3>
                <p className="text-gray-300 text-sm">When you place an order, you agree to pay the listed price plus any applicable delivery fees and taxes. Orders are subject to availability and vendor confirmation.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">Payment Processing</h3>
                <p className="text-gray-300 text-sm">Payments are processed through secure payment gateways. We accept M-Pesa, Credit/Debit Cards, and Wallet Balance. All transactions are encrypted and secure.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">Escrow Protection</h3>
                <p className="text-gray-300 text-sm">Payments are held in escrow until delivery is confirmed. This ensures both buyers and sellers are protected throughout the transaction process.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">🚚 Delivery & Returns</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-white font-semibold">Delivery Policy</h3>
                <p className="text-gray-300 text-sm">We strive to deliver orders within the estimated timeframe. Delivery times are estimates and may vary based on location, vendor availability, and other factors.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">Delivery Code</h3>
                <p className="text-gray-300 text-sm">Upon delivery, you will receive a 6-digit delivery code. Provide this code to the driver only upon receiving your items. Do not share this code with anyone else.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">Returns & Refunds</h3>
                <p className="text-gray-300 text-sm">Returns and refunds are handled on a case-by-case basis. Please contact our support team within 7 days of delivery to initiate a return or refund request.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">📋 Vendor Terms</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-white font-semibold">Vendor Registration</h3>
                <p className="text-gray-300 text-sm">Vendors must complete the registration process and be approved by our admin team before listing products on our platform.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">Product Listings</h3>
                <p className="text-gray-300 text-sm">Vendors are responsible for accurate product descriptions, pricing, and availability. Products must meet quality standards and comply with all applicable regulations.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">Commission</h3>
                <p className="text-gray-300 text-sm">A commission fee applies to each sale made through our platform. The current commission rate is 10% of the product price. This supports platform operations and payment processing.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">🔒 User Conduct</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Provide accurate and truthful information',
                'Do not engage in fraudulent activities',
                'Respect other users and vendors',
                'Do not misuse the platform or services',
                'Comply with all applicable laws and regulations',
                'Do not attempt to bypass security measures',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">⚖️ Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              AgriVibe Marketplace is provided "as is" and "as available". We do not warrant that our platform will be uninterrupted, error-free, or free of viruses or other harmful components. We are not liable for any damages arising from the use of our platform or services.
            </p>
            <p className="text-gray-300 leading-relaxed mt-3">
              We are not responsible for the quality, safety, or legality of products sold by vendors. All transactions are between buyers and vendors, with our platform facilitating the connection and payment process.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">📧 Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Kenya.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">🔄 Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to update or modify these Terms & Conditions at any time. Changes will be posted on this page with an updated date. Continued use of our platform after any changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">📩 Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="mt-3 text-gray-300">
              <p>📧 Email: <a href="mailto:legal@agrivibe.com" className="text-yellow-400 hover:text-yellow-300">legal@agrivibe.com</a></p>
              <p>📞 Phone: +254 700 000 000</p>
              <p>📍 AgriVibe KE Farm Solutions, Nairobi, Kenya</p>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm pt-4 border-t border-white/10">
            <p>© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}