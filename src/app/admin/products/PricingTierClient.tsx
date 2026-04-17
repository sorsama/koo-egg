"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { deletePricingTier, upsertPricingTier } from "./actions";

type Tier = { id: string; accountType: string; price: number };

const ACCOUNT_TYPES = [
  { value: "CONSUMER", label: "Consumer", color: "border-emerald-500 bg-emerald-50 text-emerald-800" },
  { value: "FOOD_BUSINESS", label: "Food Business", color: "border-purple-500 bg-purple-50 text-purple-800" },
  { value: "RETAILER", label: "Retailer", color: "border-amber-500 bg-amber-50 text-amber-800" },
];

export default function PricingTierClient({
  productId,
  productName,
  basePrice,
  tiers,
}: {
  productId: string;
  productName: string;
  basePrice: number;
  tiers: Tier[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const formData = new FormData(e.currentTarget);
    formData.set("productId", productId);
    try {
      await upsertPricingTier(formData);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = (tierId: string) => {
    if (!confirm("Remove this pricing tier?")) return;
    startTransition(async () => {
      try {
        await deletePricingTier(tierId);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Delete failed");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-colors rounded-md"
      >
        Tiers
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50">
          <div className="bg-white rounded-lg p-8 w-full max-w-xl border-4 border-gray-900 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-1">Pricing Tiers</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
              {productName} · Base ฿{basePrice.toFixed(2)}
            </p>

            <div className="space-y-3 mb-6">
              {tiers.length === 0 ? (
                <div className="p-4 border-4 border-dashed border-gray-300 text-xs font-bold uppercase tracking-widest text-gray-500 text-center">
                  No tiers yet — add one below
                </div>
              ) : (
                tiers.map((t) => {
                  const meta = ACCOUNT_TYPES.find((a) => a.value === t.accountType);
                  return (
                    <div
                      key={t.id}
                      className={`flex items-center justify-between border-l-4 p-4 ${meta?.color ?? "border-gray-300 bg-gray-50 text-gray-700"}`}
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">{meta?.label ?? t.accountType}</p>
                        <p className="text-lg font-black">฿{t.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 border-t-4 border-gray-100 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Account Type</label>
                  <select
                    name="accountType"
                    required
                    defaultValue="CONSUMER"
                    className="w-full border-4 border-gray-900 px-3 py-2 font-bold bg-white"
                  >
                    {ACCOUNT_TYPES.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Price (฿)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    className="w-full border-4 border-gray-900 px-3 py-2 font-bold"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 bg-blue-500 text-white font-black uppercase tracking-widest text-xs rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {busy ? "Saving..." : "Save Tier (creates or updates)"}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
