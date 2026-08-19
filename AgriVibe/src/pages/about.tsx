import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-4xl mx-auto pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🌾</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">About AgriVibe Marketplace</h1>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Transforming how people access fresh agricultural products across Kenya.
          </p>
        </div>

        <div className="space-y-8">
          {/* Who We Are */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">🌱 Who We Are</h2>
            <p className="text-gray-300 leading-relaxed">
              AgriVibe Marketplace is proudly developed and operated by <strong className="text-white">AgriVibe KE Farm Solutions</strong>, an innovative agribusiness and technology company committed to modernizing agricultural commerce through digital solutions.
            </p>
            <p className="text-gray-300 leading-relaxed mt-3">
              We believe that technology has the power to eliminate unnecessary barriers between producers and consumers. By connecting farmers, vendors, wholesalers, and customers on one trusted platform, we create a transparent marketplace where quality products, fair pricing, and reliable service come together.
            </p>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h2 className="text-2xl font-bold text-yellow-400 mb-3">👁️ Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                To become Kenya's most trusted digital agricultural marketplace, empowering farmers, supporting local businesses, and making fresh, affordable food accessible to every household, institution, and community through innovative technology.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h2 className="text-2xl font-bold text-yellow-400 mb-3">🎯 Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                To simplify agricultural commerce by providing a secure, reliable, and user-friendly marketplace that connects producers directly with consumers, while promoting fair trade and sustainable agricultural development.
              </p>
            </div>
          </div>

          {/* What We Do */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">🛒 What We Do</h2>
            <p className="text-gray-300 leading-relaxed">
              AgriVibe Marketplace brings together a diverse network of verified vendors offering fresh farm produce, groceries, agricultural products, and related services. Through our platform, customers can easily browse products, compare prices, place secure orders, and enjoy convenient delivery options.
            </p>
            <p className="text-gray-300 leading-relaxed mt-3">
              Our marketplace also provides vendors with digital tools to manage products, process orders, monitor sales, and grow their businesses within a secure online environment.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">⭐ Why Choose AgriVibe Marketplace</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Fresh, high-quality agricultural products',
                'Competitive and transparent pricing',
                'Verified vendors and trusted suppliers',
                'Secure online shopping',
                'Convenient order management',
                'Reliable delivery verification',
                'Continuous innovation and customer support',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300">
                  <span className="text-yellow-400">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Our Values */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">💎 Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Integrity', desc: 'We operate with honesty, transparency, and accountability.' },
                { title: 'Innovation', desc: 'We embrace technology to solve real-world agricultural challenges.' },
                { title: 'Quality', desc: 'We are committed to delivering products and services that exceed expectations.' },
                { title: 'Customer Focus', desc: 'Every decision is centered around creating exceptional experiences.' },
                { title: 'Sustainability', desc: 'We support environmentally responsible practices and community growth.' },
                { title: 'Collaboration', desc: 'Strong partnerships create stronger communities and businesses.' },
              ].map((value, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-white font-semibold">{value.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Farmers */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">🌾 Supporting Farmers and Local Businesses</h2>
            <p className="text-gray-300 leading-relaxed">
              Every purchase made through AgriVibe Marketplace contributes to strengthening Kenya's agricultural economy. By providing farmers and local businesses with access to a wider customer base, we help create sustainable income opportunities while encouraging responsible agricultural practices and community development.
            </p>
          </div>

          {/* Innovation */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">💡 Innovation Through Technology</h2>
            <p className="text-gray-300 leading-relaxed">
              AgriVibe Marketplace leverages modern digital technologies to simplify agricultural trade. From intelligent product management and secure payment integrations to delivery verification and real-time order tracking, our platform is designed to provide a seamless experience for customers and vendors alike.
            </p>
            <p className="text-gray-300 leading-relaxed mt-3">
              As technology evolves, we remain committed to introducing new features that improve efficiency, enhance security, and create greater value for our growing community.
            </p>
          </div>

          {/* Quality Commitment */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">✅ Our Commitment to Quality</h2>
            <p className="text-gray-300 leading-relaxed">
              Quality is at the heart of everything we do. We continuously work with trusted farmers, wholesalers, and vendors to ensure customers receive fresh products that meet high standards of safety and quality. Through responsible sourcing and continuous platform improvements, we strive to build long-lasting relationships based on trust and reliability.
            </p>
          </div>

          {/* Looking Ahead */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded-2xl border border-yellow-500/20 p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">🚀 Looking Ahead</h2>
            <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
              As AgriVibe Marketplace continues to grow, we remain dedicated to building a smarter, more connected agricultural ecosystem where technology empowers farmers, strengthens local businesses, and makes fresh food more accessible to every Kenyan.
            </p>
            <p className="text-gray-400 mt-4">Our journey is driven by continuous innovation, trusted partnerships, and a commitment to creating lasting value for everyone we serve.</p>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-white font-semibold text-lg">🌾 Powered by AgriVibe KE Farm Solutions</p>
            <p className="text-gray-500 text-sm mt-1">Innovating Agriculture. Empowering Communities. Delivering Trust.</p>
          </div>
        </div>
      </div>
    </div>
  );
}