import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

export default function Guides() {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await api.get('/guides');
      setGuides(response.data.guides || []);
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <div className="pt-24 px-4 text-center text-gray-400">Loading guides...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-7xl mx-auto pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            📚 AgriVibe <span className="text-yellow-400">Guides</span>
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Expert guides from AgriVibe KE Farm Solutions
          </p>
        </div>

        {guides.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No guides available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((guide: any) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`}>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:border-yellow-400/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  {guide.cover_image ? (
                     <img src={guide.cover_image} alt={guide.title} className="w-full h-48 object-cover rounded-xl mb-4" />
                     ) : (
                       <div className="w-full h-48 bg-gradient-to-br from-yellow-500/20 to-green-500/20 rounded-xl mb-4 flex items-center justify-center text-6xl">📖</div>
                    )}
                  <h2 className="text-xl font-bold text-white">{guide.title}</h2>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{guide.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-yellow-400 font-bold">KES {guide.price}</span>
                    {guide.is_featured && (
                      <span className="bg-yellow-400/20 text-yellow-400 text-xs px-2 py-1 rounded-full">⭐ Featured</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}