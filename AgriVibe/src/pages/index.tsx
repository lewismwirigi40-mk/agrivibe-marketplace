
import Link from 'next/link';
import AIChat from '../components/AIChat';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AnimatedCounter from '../components/AnimatedCounter';
import PremiumButton from '../components/PremiumButton';
import FloatingButtons from '../components/FloatingButtons';

export default function Home() {
  // Test backend connection
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <AIChat />
      {/* Floating WhatsApp & Scroll buttons */}
      <FloatingButtons />

     {/* ====== HERO SECTION with Stunning Background ====== */}
<section className="relative overflow-hidden px-4 pt-28 pb-16 md:pt-36 md:pb-24 min-h-[90vh] flex items-center">
  {/* Background Image - FULL COVER */}
  <div 
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('https://images.pexels.com/photos/1233318/pexels-photo-1233318.jpeg?auto=compress&cs=tinysrgb&w=1920')",
    backgroundColor: '#1a3a1a'
  }}
/>
<div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-emerald-900/70" /> {/* Dark overlay for text readability */}

  <div className="max-w-7xl mx-auto relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-4xl mx-auto text-white"
    >
      {/* Badge */}
      <span className="inline-block bg-green-600/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
        🌱 Fresh from the Farm
      </span>

      {/* Headline */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
        Fresh From Farms.
        <br />
        <span className="text-yellow-400">
          Delivered to Your Campus.
        </span>
      </h1>

      {/* Subtext */}
     <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
        Buy directly from verified vendors and local farmers with secure payments and fast delivery.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <PremiumButton href="/marketplace" variant="primary" size="lg">
          <span className="flex items-center gap-2">
            🛒 Start Shopping
          </span>
        </PremiumButton>
        <PremiumButton href="/vendor/register" variant="secondary" size="lg">
          <span className="flex items-center gap-2">
            👨‍🌾 Become a Vendor
          </span>
        </PremiumButton>
      </div>
    </motion.div>

    {/* Stats with animated counters */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="flex flex-wrap justify-center gap-8 md:gap-12 mt-16 max-w-3xl mx-auto"
    >
      <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl py-4 px-6 shadow-sm min-w-[100px] border border-white/20">
        <AnimatedCounter target={12000} suffix="+" />
        <div className="text-sm text-white/80">Products</div>
      </div>
      <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl py-4 px-6 shadow-sm min-w-[100px] border border-white/20">
        <AnimatedCounter target={350} suffix="+" />
        <div className="text-sm text-white/80">Vendors</div>
      </div>
      <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl py-4 px-6 shadow-sm min-w-[100px] border border-white/20">
        <AnimatedCounter target={22} />
        <div className="text-sm text-white/80">Campuses</div>
      </div>
      <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl py-4 px-6 shadow-sm min-w-[100px] border border-white/20">
        <AnimatedCounter target={95} suffix="%" />
        <div className="text-sm text-white/80">Satisfaction</div>
      </div>
    </motion.div>
  </div>
</section>
      {/* ====== WHY CHOOSE US ====== */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-green-600">AgriVibe</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '✅', title: 'Verified Vendors', desc: 'All vendors are verified before they can sell.' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Payments are protected with escrow and encryption.' },
              { icon: '🚚', title: 'Campus Delivery', desc: 'Fast and reliable delivery to your campus.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CATEGORIES ====== */}
      <section className="px-4 py-16 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Browse by <span className="text-green-600">Category</span></h2>
            <p className="text-gray-600 mt-2">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { icon: '🥬', name: 'Vegetables' },
              { icon: '🍎', name: 'Fruits' },
              { icon: '🥩', name: 'Meat' },
              { icon: '🥛', name: 'Dairy' },
              { icon: '🍞', name: 'Bakery' },
              { icon: '🐔', name: 'Poultry' },
              { icon: '🐟', name: 'Fish' },
              { icon: '🌽', name: 'Cereals' },
              { icon: '🌸', name: 'Flowers' },
              { icon: '🧴', name: 'Household' },
              { icon: '📚', name: 'Stationery' },
              { icon: '🍔', name: 'Restaurants' },
            ].map((cat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100 hover:border-green-200"
              >
                <div className="text-3xl md:text-4xl mb-2">{cat.icon}</div>
                <div className="text-sm font-medium text-gray-700">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">How <span className="text-green-600">AgriVibe</span> Works</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              From farm to your doorstep in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: '🛒', title: 'Choose Products', desc: 'Browse fresh produce from verified vendors near your campus.' },
              { step: '2', icon: '🔒', title: 'Pay Securely', desc: 'Pay via M-Pesa, card, or wallet. Your money is held in escrow.' },
              { step: '3', icon: '🚚', title: 'Delivery', desc: 'A driver picks up your order and delivers to your campus.' },
              { step: '4', icon: '✅', title: 'Confirm & Release', desc: 'Confirm delivery and the vendor gets paid. Simple and safe.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700 mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CAMPUS SELECTOR ====== */}
      <section className="px-4 py-16 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Find Vendors Near <span className="text-green-600">You</span>
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              We'll show you vendors within 15km of your location
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            {/* GPS Location Button */}
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      alert(`📍 Location detected: ${position.coords.latitude}, ${position.coords.longitude}\nVendors within 15km will be shown.`);
                    },
                    () => {
                      alert('Please enable location services to find vendors near you.');
                    }
                  );
                } else {
                  alert('Geolocation is not supported by your browser.');
                }
              }}
            >
              <span className="text-2xl">📍</span>
              Detect My Location
            </button>

            <p className="text-gray-400 text-sm">or</p>

            {/* Manual Campus Entry */}
            <div className="flex flex-wrap justify-center gap-3">
              <input
                type="text"
                placeholder="Search for your campus or town..."
                className="px-6 py-3 border border-gray-300 rounded-xl w-64 md:w-80 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition">
                Search
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              📍 Vendors within 15km radius will be shown. GPS required.
            </p>
          </div>
        </div>
      </section>

      {/* ====== FEATURED PRODUCTS ====== */}
      <section className="px-4 py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">🔥 Featured <span className="text-green-600">Products</span></h2>
              <p className="text-gray-600 mt-1">Handpicked fresh produce from top vendors</p>
            </div>
            <PremiumButton href="/marketplace" variant="ghost" size="sm">
              View All →
            </PremiumButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                name: 'Fresh Tomatoes', 
                price: 'KES 150/kg', 
                image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
                vendor: 'Green Farm', 
                rating: '4.8' 
              },
              { 
                name: 'Organic Kale', 
                price: 'KES 80/bunch', 
                image: 'https://images.unsplash.com/photo-1524179094475-0a6c6a89df4a?w=400&h=300&fit=crop',
                vendor: 'Healthy Greens', 
                rating: '4.9' 
              },
              { 
                name: 'Sweet Avocado', 
                price: 'KES 120/3pcs', 
                image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop',
                vendor: 'Avocado Paradise', 
                rating: '4.7' 
              },
              { 
                name: 'Fresh Spinach', 
                price: 'KES 100/bunch', 
                image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
                vendor: 'Veggie Fresh', 
                rating: '4.6' 
              },
            ].map((product, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">⭐ {product.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">{product.vendor}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-green-700 font-bold">{product.price}</span>
                    <PremiumButton variant="primary" size="sm">
                      Add to Cart
                    </PremiumButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* ====== TESTIMONIALS ====== */}
<section className="px-4 py-16 bg-gradient-to-b from-white to-green-50">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
      <h2 className="text-3xl md:text-4xl font-bold mt-2">
        What Our <span className="text-green-600">Customers Say</span>
      </h2>
      <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
        Real reviews from real people who love fresh farm produce
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          name: 'Jane Mwangi',
          campus: 'DeKUT',
          comment: 'AgriVibe has changed how I buy vegetables. Fresh, affordable, and delivered to my campus!',
          rating: 5,
          image: '👩‍🎓',
          date: '2 weeks ago'
        },
        {
          name: 'Peter Kariuki',
          campus: 'KU',
          comment: 'The delivery is always on time and the produce is farm-fresh. I recommend AgriVibe to all my friends.',
          rating: 5,
          image: '👨‍🎓',
          date: '1 month ago'
        },
        {
          name: 'Mary Wanjiru',
          campus: 'JKUAT',
          comment: 'I love that I can support local farmers while getting quality products. The escrow system gives me peace of mind.',
          rating: 5,
          image: '👩‍🌾',
          date: '3 weeks ago'
        },
      ].map((testimonial, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              {testimonial.image}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
              <p className="text-sm text-gray-500">{testimonial.campus}</p>
            </div>
          </div>
          <div className="flex text-yellow-500 mb-2">
            {'⭐'.repeat(testimonial.rating)}
            <span className="text-gray-400 text-sm ml-2">({testimonial.rating}.0)</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">"{testimonial.comment}"</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-block text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              ✅ Verified Purchase
            </span>
            <span className="text-xs text-gray-400">{testimonial.date}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


{/* ====== NEWSLETTER ====== */}
<section className="px-4 py-16 bg-gradient-to-r from-green-700 to-emerald-700">
  <div className="max-w-3xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-white">
      Stay Updated with <span className="text-yellow-400">AgriVibe</span>
    </h2>
    <p className="text-green-100 mt-2">
      Subscribe to get the latest deals, new products, and campus updates
    </p>
    <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-yellow-400 outline-none"
      />
      <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold transition">
        Subscribe
      </button>
    </div>
    <p className="text-green-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
  </div>
</section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-gray-900 text-white/70 px-4 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-2xl font-bold text-white">🌾 AgriVibe</p>
          <p className="text-sm text-white/50 mt-1">Sponsored by AgriVibe KE Farm Solutions</p>
          <p className="mt-2">Connecting farmers, vendors, and customers across campuses.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          </div>
          <p className="mt-6 text-sm text-white/40">© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}