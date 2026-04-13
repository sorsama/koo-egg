"use client";

import { useState } from "react";
import { createSubscription } from "./actions";
import SyncIcon from "@mui/icons-material/Sync";
import CloseIcon from "@mui/icons-material/Close";

export default function SubscribeButton({ 
  productId, 
  customerId, 
  productName 
}: { 
  productId: string; 
  customerId: string; 
  productName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createSubscription(formData);
      setIsOpen(false);
      alert("Subscription created! You can manage it in your profile.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-5 bg-amber-50 border-4 border-amber-500 text-amber-800 font-black text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-3"
      >
        <SyncIcon fontSize="small" />
        Schedule Auto-Delivery
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80">
          <div className="w-full max-w-sm bg-white border-8 border-gray-900 p-8 space-y-8 relative">
             <button 
               onClick={() => setIsOpen(false)}
               className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors"
             >
               <CloseIcon fontSize="medium" />
             </button>

             <div className="space-y-2 pr-8">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">Setup Subscription</h3>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Auto-delivery for {productName}</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="productId" value={productId} />
                <input type="hidden" name="customerId" value={customerId} />

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Frequency</label>
                   <select 
                     name="frequency" 
                     className="w-full bg-gray-50 border-4 border-gray-200 rounded-none px-4 py-4 text-sm font-black text-gray-900 uppercase tracking-widest focus:outline-none focus:border-amber-500 appearance-none"
                   >
                      <option value="WEEKLY">Weekly Delivery</option>
                      <option value="BIWEEKLY">Every 2 Weeks</option>
                      <option value="MONTHLY">Monthly Delivery</option>
                   </select>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Quantity (Trays/Units)</label>
                   <input 
                     type="number" 
                     name="quantity" 
                     defaultValue={30}
                     min={10}
                     className="w-full bg-gray-50 border-4 border-gray-200 rounded-none px-4 py-4 text-sm font-black text-gray-900 uppercase tracking-widest focus:outline-none focus:border-amber-500"
                   />
                </div>

                <div className="p-4 bg-amber-100 border-l-8 border-amber-500 flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white font-black shrink-0">!</div>
                   <p className="text-[10px] text-amber-900 leading-relaxed font-black uppercase tracking-widest">
                      5% discount automatically applied to all subscription orders.
                   </p>
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full py-5 bg-amber-500 text-white font-black text-sm uppercase tracking-widest hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Activating..." : "Activate Subscription"}
                </button>
             </form>
          </div>
        </div>
      )}
    </>
  );
}
