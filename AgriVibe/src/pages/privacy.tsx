import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-4xl mx-auto pb-16">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-gray-500 text-sm mt-2">Last Updated: August 2026</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">📋 Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              AgriVibe Marketplace ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and services.
            </p>
            <p className="text-gray-300 leading-relaxed mt-3">
              By using AgriVibe Marketplace, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">📊 Information We Collect</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-white font-semibold">Personal Information</h3>
                <p className="text-gray-300 text-sm">Name, email address, phone number, delivery address, and payment information when you register, place orders, or contact us.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">Usage Data</h3>
                <p className="text-gray-300 text-sm">Information about how you interact with our platform, including pages visited, products viewed, order history, and browsing patterns.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">Device Information</h3>
                <p className="text-gray-300 text-sm">IP address, browser type, device type, operating system, and location data (if enabled) to improve our services and security.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">🔐 How We Use Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Process and fulfill your orders',
                'Provide delivery and payment services',
                'Communicate with you about orders and updates',
                'Improve our platform and user experience',
                'Prevent fraud and ensure security',
                'Personalize your shopping experience',
                'Send promotional offers (with your consent)',
                'Comply with legal and regulatory requirements',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">🤝 Sharing Your Information</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-3 space-y-1">
              <li>Vendors to fulfill your orders and deliver products</li>
              <li>Drivers for delivery services</li>
              <li>Payment processors to process transactions</li>
              <li>Service providers who assist in platform operations</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">🛡️ Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-3 space-y-1">
              <li>Secure servers and encrypted connections</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Regular security assessments and monitoring</li>
              <li>Data encryption for sensitive information</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">🍪 Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies to enhance your browsing experience, remember your preferences, and analyze how you interact with our platform. You can control cookie settings through your browser preferences.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">👤 Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-300 mt-3 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing where applicable</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">📧 Third-Party Links</h2>
            <p className="text-gray-300 leading-relaxed">
              Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">👶 Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              AgriVibe Marketplace is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">🔄 Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date. We encourage you to review this policy periodically.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">📩 Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
            </p>
            <div className="mt-3 text-gray-300">
              <p>📧 Email: <a href="mailto:privacy@agrivibe.com" className="text-yellow-400 hover:text-yellow-300">privacy@agrivibe.com</a></p>
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