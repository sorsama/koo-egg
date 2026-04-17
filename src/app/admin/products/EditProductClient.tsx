"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { archiveProduct, unarchiveProduct, updateProduct } from "./actions";

type Product = {
  id: string;
  name: string;
  poultryType: string;
  gradeSize: string;
  weightRange: string;
  basePrice: number;
  stockQuantity: number;
  unit: string;
  description: string | null;
  isArchived: boolean;
};

export default function EditProductClient({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateProduct(product.id, formData);
      setIsOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = () => {
    if (!confirm(product.isArchived ? "Restore this product?" : "Archive this product? It will hide from the catalog (historical orders keep working).")) return;
    startTransition(async () => {
      try {
        if (product.isArchived) await unarchiveProduct(product.id);
        else await archiveProduct(product.id);
        setIsOpen(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Action failed");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-colors duration-200 rounded-md"
      >
        Edit
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-none border-4 border-gray-900 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors font-bold"
            >
              ✕
            </button>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-6">Edit Product</h2>

            {product.isArchived ? (
              <div className="mb-4 p-3 bg-amber-100 border-4 border-amber-500 text-amber-900 text-xs font-black uppercase tracking-widest">
                Archived — hidden from catalog
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                  <input required name="name" type="text" defaultValue={product.name}
                    className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Poultry Type</label>
                  <select required name="poultryType" defaultValue={product.poultryType}
                    className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all appearance-none">
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
                  <input required name="gradeSize" type="text" defaultValue={product.gradeSize}
                    className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weight Range</label>
                  <input required name="weightRange" type="text" defaultValue={product.weightRange}
                    className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Base Price (฿)</label>
                  <input required name="basePrice" type="number" step="0.01" defaultValue={product.basePrice}
                    className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Qty</label>
                  <input required name="stockQuantity" type="number" defaultValue={product.stockQuantity}
                    className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Unit</label>
                <input name="unit" type="text" defaultValue={product.unit}
                  className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea name="description" rows={3} defaultValue={product.description ?? ""}
                  className="w-full bg-gray-100 text-gray-900 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-2 border-transparent focus:border-blue-500 transition-all" />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleArchive}
                  disabled={isPending}
                  className={`px-4 py-3 font-black uppercase tracking-widest text-xs rounded-md transition-colors disabled:opacity-50 ${
                    product.isArchived
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {product.isArchived ? "Restore" : "Archive"}
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-all duration-200 uppercase tracking-widest disabled:opacity-50 text-sm">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
