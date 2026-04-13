"use client";

import { useState } from "react";
import { createProduct } from "./actions";

export default function AddProductClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createProduct(formData);
      setIsOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-500 text-white font-bold rounded-md hover:scale-105 hover:bg-blue-600 transition-all duration-200 uppercase tracking-widest text-sm"
      >
        + Add Product
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-none border-4 border-gray-900 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors font-bold"
            >
              ✕
            </button>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-6">Add Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                  <input required name="name" type="text" className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" placeholder="e.g. Jumbo Egg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Poultry Type</label>
                  <select required name="poultryType" className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all appearance-none">
                    <option value="CHICKEN">Chicken</option>
                    <option value="DUCK">Duck</option>
                    <option value="GOOSE">Goose</option>
                    <option value="QUAIL">Quail</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Grade/Size</label>
                  <input required name="gradeSize" type="text" className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" placeholder="e.g. Size 0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weight Range</label>
                  <input required name="weightRange" type="text" className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" placeholder="e.g. >70g" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Base Price (฿)</label>
                  <input required name="basePrice" type="number" step="0.01" className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" placeholder="e.g. 5.50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Qty</label>
                  <input required name="stockQuantity" type="number" className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" placeholder="e.g. 1000" />
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={loading} className="w-full py-4 bg-blue-500 text-white font-bold rounded-md hover:scale-[1.02] hover:bg-blue-600 transition-all duration-200 uppercase tracking-widest disabled:opacity-50 disabled:scale-100 text-sm">
                  {loading ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
