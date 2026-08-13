import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    cover_image: '',
    file_url: '',
    file_size: '',
    is_featured: false
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [guideFile, setGuideFile] = useState<File | null>(null);

  // ============================================
  // FETCH GUIDES
  // ============================================
  const fetchGuides = async () => {
    try {
      console.log('🔍 Fetching guides from:', api.defaults.baseURL + '/guides');
      const response = await api.get('/guides');
      console.log('✅ Guides fetched:', response.data);
      setGuides(response.data.guides || []);
    } catch (error) {
      console.error('❌ Failed to fetch guides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // ============================================
  // HANDLE FORM CHANGES
  // ============================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // ============================================
  // UPLOAD FILE
  // ============================================
  const uploadFile = async (file: File): Promise<string> => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    
    try {
      const response = await api.post('/upload/single', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // ============================================
  // HANDLE COVER IMAGE CHANGE
  // ============================================
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, cover_image: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // ============================================
  // HANDLE GUIDE FILE CHANGE
  // ============================================
  const handleGuideFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGuideFile(e.target.files[0]);
      const size = (e.target.files[0].size / (1024 * 1024)).toFixed(1);
      setFormData({ ...formData, file_size: `${size}MB` });
    }
  };

  // ============================================
  // SUBMIT FORM
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let coverImageUrl = formData.cover_image;
      let fileUrl = formData.file_url;

      if (coverFile) {
        coverImageUrl = await uploadFile(coverFile);
      }

      if (guideFile) {
        fileUrl = await uploadFile(guideFile);
      }

      const guideData = {
        ...formData,
        cover_image: coverImageUrl,
        file_url: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      };

      if (editing) {
        await api.put(`/guides/${editing.id}`, guideData);
        alert('Guide updated successfully!');
      } else {
        await api.post('/guides', guideData);
        alert('Guide created successfully!');
      }

      setShowForm(false);
      setEditing(null);
      setFormData({ title: '', description: '', price: '', category: '', cover_image: '', file_url: '', file_size: '', is_featured: false });
      setCoverFile(null);
      setGuideFile(null);
      if (coverInputRef.current) coverInputRef.current.value = '';
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchGuides();
    } catch (error) {
      alert('Failed to save guide');
    } finally {
      setUploading(false);
    }
  };

  // ============================================
  // DELETE GUIDE
  // ============================================
  const deleteGuide = async (id: string) => {
    if (!confirm('Delete this guide?')) return;
    try {
      await api.delete(`/guides/${id}`);
      fetchGuides();
    } catch (error) {
      alert('Failed to delete guide');
    }
  };

  // ============================================
  // EDIT GUIDE
  // ============================================
  const editGuide = (guide: any) => {
    setEditing(guide);
    setFormData({
      title: guide.title,
      description: guide.description || '',
      price: guide.price,
      category: guide.category || '',
      cover_image: guide.cover_image || '',
      file_url: guide.file_url || '',
      file_size: guide.file_size || '',
      is_featured: guide.is_featured || false
    });
    setShowForm(true);
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-400 py-12">Loading guides...</div>
      </AdminLayout>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <AdminLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">📚 Guides</h1>
          <p className="text-gray-400 mt-1">Manage AgriVibe guides</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ title: '', description: '', price: '', category: '', cover_image: '', file_url: '', file_size: '', is_featured: false });
            setCoverFile(null);
            setGuideFile(null);
            if (coverInputRef.current) coverInputRef.current.value = '';
            if (fileInputRef.current) fileInputRef.current.value = '';
            setShowForm(!showForm);
          }}
          className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
        >
          {showForm ? 'Cancel' : '+ Add Guide'}
        </button>
      </div>

      {/* ============================================
          FORM
          ============================================ */}
      {showForm && (
        <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{editing ? 'Edit Guide' : 'Create Guide'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Price (KES) *</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 outline-none transition"
                >
                  <option value="">Select Category</option>
                  <option value="Farming">Farming</option>
                  <option value="Business">Business</option>
                  <option value="Technology">Technology</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Livestock">Livestock</option>
                  <option value="Crops">Crops</option>
                </select>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cover Image</label>
              
              {/* Show existing image when editing */}
              {editing && formData.cover_image && (
                <div className="mb-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm mb-2">Current cover image:</p>
                  <img 
                    src={formData.cover_image} 
                    alt="Current cover" 
                    className="h-24 object-cover rounded-lg"
                  />
                  <p className="text-gray-500 text-xs mt-2">Upload a new image to replace it (optional)</p>
                </div>
              )}
              
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
              />
              
              {/* Preview new image when selected */}
              {!editing && formData.cover_image && (
                <div className="mt-2">
                  <img src={formData.cover_image} alt="Preview" className="h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>

            {/* Guide File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Guide File (PDF, ZIP, etc.)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.zip,.doc,.docx"
                onChange={handleGuideFileChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
              />
              {formData.file_size && (
                <p className="text-gray-400 text-sm mt-1">📦 File size: {formData.file_size}</p>
              )}
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 accent-yellow-400"
              />
              <label className="text-sm font-medium text-gray-300">Featured Guide</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : (editing ? 'Update Guide' : 'Create Guide')}
            </button>
          </form>
        </div>
      )}

      {/* ============================================
          GUIDE LIST
          ============================================ */}
      <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="text-center text-gray-400 p-8">Loading...</div>
        ) : guides.length === 0 ? (
          <div className="text-center text-gray-400 p-8">No guides found. Create your first guide!</div>
        ) : (
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Cover</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Title</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Price</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Downloads</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide: any) => (
                <tr key={guide.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    {guide.cover_image ? (
                      <img src={guide.cover_image} alt={guide.title} className="w-12 h-12 object-cover rounded-lg" />
                    ) : (
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl">📖</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white">{guide.title}</td>
                  <td className="px-6 py-4 text-yellow-400 font-semibold">KES {guide.price}</td>
                  <td className="px-6 py-4 text-gray-300">{guide.downloads || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${guide.is_active ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
                      {guide.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => editGuide(guide)} className="text-yellow-400 hover:text-yellow-300 text-sm transition mr-3">
                      Edit
                    </button>
                    <button onClick={() => deleteGuide(guide.id)} className="text-red-400 hover:text-red-300 text-sm transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}