// src/pages/vendor/products/[id]/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Edit,
  Trash2,
  ShoppingBag,
  Store,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import VendorLayout from "../../../../components/VendorLayout";
import api from "../../../../services/api";

export default function ViewProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await api.get(`/vendor/products/${id}`);
      setProduct(response.data.product || response.data);
    } catch (error: any) {
      console.error("Failed to fetch product:", error);
      setError(error.response?.data?.error || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);
    try {
      await api.delete(`/vendor/products/${id}`);
      router.push("/vendor/products");
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-agrivibe-green animate-spin" />
        </div>
      </VendorLayout>
    );
  }

  if (error || !product) {
    return (
      <VendorLayout>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-medium">
            {error || "Product not found"}
          </p>
          <button
            onClick={() => router.push("/vendor/products")}
            className="mt-4 bg-red-100 text-red-700 px-6 py-2 rounded-xl hover:bg-red-200 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </VendorLayout>
    );
  }

  const isActive = product.is_active !== false;
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/vendor/products")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <Store className="w-4 h-4" />
                {product.store?.store_name || "Your Store"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/vendor/products/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-xl font-bold text-agrivibe-green">
              {formatCurrency(product.price)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <p className="text-sm text-gray-500">Stock</p>
            <p
              className={`text-xl font-bold ${isOutOfStock ? "text-red-500" : "text-gray-900"}`}
            >
              {product.stock_quantity} units
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex items-center gap-2 mt-1">
              {isActive ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                  <AlertCircle className="w-3 h-3" />
                  Inactive
                </span>
              )}
              {isOutOfStock && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <p className="text-sm text-gray-500">Added</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(product.created_at)}
            </p>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gray-400" />
            Product Images
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {product.images && product.images.length > 0 ? (
              product.images.map((img: string, index: number) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200"
                >
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No images uploaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-600">
            {product.description || "No description provided."}
          </p>
        </div>

        {/* Category & Unit */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-900">
                {product.category?.name || "Uncategorized"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Unit</p>
              <p className="font-medium text-gray-900">
                {product.unit || "piece"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
