import VendorLayout from '../../../components/VendorLayout';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    unit: 'kg',
    category: '',
    description: '',
    status: 'pending',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Will connect to backend later
    setTimeout(() => {
      setLoading(false);
      router.push('/vendor/products');
    }, 1500);
  };

  return (
    <VendorLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">Add New Product</h1>
        <p className="text-gray-400 mt-1">Add a new product to your store</p>
        <p className="text-yellow-400 text-sm mt-1">⚠️ Product must be approved by admin before going live</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Product Name *</label>
            <input
              name="name"
              placeholder="e.g., Fresh Organic Tomatoes"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Price *</label>
            <input
              name="price"
              placeholder="e.g., 150"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Stock Quantity *</label>
            <input
              name="stock"
              type="number"
              placeholder="e.g., 100"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="piece">piece</option>
              <option value="bunch">bunch</option>
              <option value="pack">pack</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
              required
            >
              <option value="">Select Category</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="meat">Meat</option>
              <option value="dairy">Dairy</option>
              <option value="bakery">Bakery</option>
              <option value="poultry">Poultry</option>
              <option value="fish">Fish</option>
              <option value="cereals">Cereals</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
          />
          {imageFile && <p className="text-green-400 text-sm mt-1">✅ {imageFile.name} selected</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Describe your product..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
          />
          <p className="text-gray-400 text-xs mt-1">💡  AgriVibe AI will generate a description if left blank</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </VendorLayout>
  );
}