import { useState } from 'react';
import Navbar from '../components/Navbar';
import PremiumButton from '../components/PremiumButton';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Will connect to backend later
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-6xl mx-auto pb-16">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📞</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            We're here to help. Whether you have a question, need assistance, or want to become a vendor.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Form */}
          <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
            
            {success && (
              <div className="bg-green-500/20 text-green-300 p-3 rounded-xl border border-green-500/30 mb-4">
                ✅ Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                  <input
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  name="phone"
                  placeholder="254700000000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Enquiry</option>
                  <option value="order">Order Assistance</option>
                  <option value="delivery">Delivery Enquiry</option>
                  <option value="vendor">Become a Vendor</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback / Suggestion</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Message *</label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                />
              </div>

              <PremiumButton type="submit" variant="primary" size="lg" className="w-full">
                {loading ? 'Sending...' : 'Send Message'}
              </PremiumButton>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:w-96 space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">📋 Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Company</p>
                  <p className="text-white font-semibold">AgriVibe KE Farm Solutions</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Marketplace</p>
                  <p className="text-white font-semibold">AgriVibe Marketplace</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-yellow-400">support@agrivibe.com</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">+254 700 000 000</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Business Hours</p>
                  <p className="text-white text-sm">Mon–Fri: 8:00 AM – 5:00 PM</p>
                  <p className="text-white text-sm">Sat: 9:00 AM – 1:00 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">💡 Quick Links</h2>
              <ul className="space-y-2">
                <li><a href="/faq" className="text-gray-300 hover:text-yellow-400 transition">❓ FAQ</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-yellow-400 transition">🌾 About Us</a></li>
                <li><a href="/privacy" className="text-gray-300 hover:text-yellow-400 transition">🔒 Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-300 hover:text-yellow-400 transition">📜 Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}