"use client";

import { useState } from "react";
import { Search, MapPin, CheckCircle2, RefreshCw, Printer, Edit, Bell, Settings, Plus } from "lucide-react";
import { createManualOrder } from "./actions";

type Product = {
  id: string;
  name: string;
  basePrice: number;
  stockQuantity: number;
  gradeSize: string;
};

type Order = {
  id: string;
  customer: { fullname: string; accountType: string | null };
  items: { quantity: number; product: { name: string } }[];
  subtotal: number;
  invoice: { invoiceNumber: string } | null;
  status: string;
  createdAt: Date;
};

export default function OrderClient({ 
  orders, 
  products, 
  totalStock 
}: { 
  orders: Order[]; 
  products: Product[];
  totalStock: number;
}) {
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("customerName", customerName);
    formData.append("quantity", quantity);
    formData.append("unitPrice", unitPrice);
    formData.append("productId", productId);
    
    try {
      await createManualOrder(formData);
      setCustomerName("");
      setQuantity("");
      setUnitPrice("");
      setProductId("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setProductId(selectedId);
    const prod = products.find(p => p.id === selectedId);
    if (prod) {
      setUnitPrice(prod.basePrice.toString());
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 p-8 font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="relative w-[400px]">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="SEARCH ORDERS..." 
            className="w-full bg-gray-100 border-none rounded-none pl-12 pr-4 py-3 text-sm font-bold uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-xs font-black tracking-widest uppercase">
            <span className="w-2 h-2 bg-white"></span>
            FIFO ENABLED
          </div>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-colors hover:scale-105">
            <Plus className="w-4 h-4 stroke-[3]" /> Add Stock
          </button>
          <div className="flex gap-4 text-gray-400">
            <Bell className="w-6 h-6 hover:text-gray-900 cursor-pointer transition-colors" />
            <Settings className="w-6 h-6 hover:text-gray-900 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Main Title Area */}
      <div className="flex justify-between items-start mb-12 border-b-4 border-gray-900 pb-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase">Order Fulfillment</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest mt-2">Real-time logistics & dispatch management</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-gray-100 text-gray-900 px-6 py-4 font-black uppercase tracking-widest hover:bg-gray-200 transition-colors">
            <Printer className="w-5 h-5 stroke-[3]" /> Print Labels
          </button>
          <button className="flex items-center gap-2 border-4 border-gray-900 text-gray-900 px-6 py-4 font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all hover:scale-105">
            <Edit className="w-5 h-5 stroke-[3]" /> Manual Entry
          </button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Main Queue) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Queue Card */}
          <div className="bg-gray-50 p-8 border-4 border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">Active Delivery Queue</h2>
                <p className="text-xs text-gray-500 font-bold tracking-widest mt-1 uppercase">STRICT FIRST-IN, FIRST-OUT</p>
              </div>
              <div className="flex gap-3">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 font-black uppercase tracking-widest text-xs">Processing: {orders.filter(o => o.status === 'PROCESSING').length || 12}</span>
                <span className="bg-amber-100 text-amber-800 px-4 py-2 font-black uppercase tracking-widest text-xs">Dispatched: {orders.filter(o => o.status === 'DELIVERED').length || 8}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-widest border-b-2 border-gray-200">
                    <th className="pb-4 font-black">ID</th>
                    <th className="pb-4 font-black">Customer</th>
                    <th className="pb-4 font-black">Details</th>
                    <th className="pb-4 font-black">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-100">
                  {orders.map((order, idx) => (
                    <tr key={order.id} className="hover:bg-white transition-colors group">
                      <td className="py-6 align-top">
                        <div className="font-black text-gray-900 text-lg">#{order.id.slice(0, 6).toUpperCase()}</div>
                        <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">RANK: {idx + 1}</div>
                      </td>
                      <td className="py-6 align-top">
                        <div className="font-black text-gray-900 text-base uppercase">{order.customer.fullname}</div>
                        <div className="mt-2 inline-block">
                           <span className={`text-[10px] px-2 py-1 font-black uppercase tracking-widest ${
                              order.customer.accountType === "FOOD_BUSINESS" ? "bg-blue-500 text-white" :
                              order.customer.accountType === "RETAILER" ? "bg-emerald-500 text-white" :
                              "bg-gray-200 text-gray-700"
                           }`}>
                             {order.customer.accountType || "CONSUMER"}
                           </span>
                        </div>
                      </td>
                      <td className="py-6 align-top text-sm font-bold text-gray-600 uppercase">
                        {order.items.map((item, i) => (
                          <div key={i} className="mb-1">
                             {item.quantity}x {item.product.name}
                          </div>
                        ))}
                      </td>
                      <td className="py-6 align-top font-black text-gray-900 text-xl">
                        ฿{order.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Walk-in Entry Form */}
          <div className="bg-blue-50 p-8 border-l-8 border-blue-500 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100 rounded-full opacity-50" />
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="p-3 bg-blue-500 text-white">
                <Settings className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Offline Walk-in</h3>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Auto-aligns with FIFO batch</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-6 relative z-10">
              <div className="col-span-2">
                <label className="block text-xs font-black text-blue-800 tracking-widest uppercase mb-2">Customer Name</label>
                <input 
                  required
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border-2 border-transparent focus:border-blue-500 rounded-none px-4 py-4 text-gray-900 outline-none font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-blue-800 tracking-widest uppercase mb-2">Quantity</label>
                <input 
                  required
                  type="number" 
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-white border-2 border-transparent focus:border-blue-500 rounded-none px-4 py-4 text-gray-900 outline-none font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-blue-800 tracking-widest uppercase mb-2">Unit Price (฿)</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full bg-white border-2 border-transparent focus:border-blue-500 rounded-none px-4 py-4 text-gray-900 outline-none font-bold uppercase"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-black text-blue-800 tracking-widest uppercase mb-2">Product Standard</label>
                <select 
                  required
                  value={productId}
                  onChange={handleProductChange}
                  className="w-full bg-white border-2 border-transparent focus:border-blue-500 rounded-none px-4 py-4 text-gray-900 outline-none font-bold uppercase appearance-none"
                >
                  <option value="" disabled>Select...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex items-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 text-white rounded-none px-4 py-4 font-black tracking-widest uppercase hover:bg-blue-700 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-8">
          
          {/* Available to Ship Widget */}
          <div className="bg-emerald-500 p-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-600 -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="text-xs font-black tracking-widest text-emerald-100 uppercase flex items-center justify-between mb-4">
                AVAILABLE TO SHIP
                <span className="bg-white text-emerald-900 px-2 py-1 text-[10px]">FIFO</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-black tracking-tighter">{totalStock.toLocaleString()}</span>
              </div>
              <div className="text-emerald-100 font-bold uppercase tracking-widest text-sm">TOTAL EGGS IN STOCK</div>
            </div>
          </div>

          {/* Map Tracking Widget */}
          <div className="bg-gray-50 border-4 border-gray-100 flex flex-col">
            <div className="p-6 flex justify-between items-center border-b-4 border-white">
              <h3 className="font-black uppercase tracking-widest text-gray-900 flex items-center gap-3">
                <MapPin className="w-5 h-5 stroke-[3]" /> Fleet GPS
              </h3>
            </div>
            
            {/* Map Mockup Area */}
            <div className="h-56 bg-gray-200 relative overflow-hidden">
              {/* Route line simulation */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M50,150 Q100,50 150,100 T250,80" fill="none" stroke="#10B981" strokeWidth="6" />
                <rect x="45" y="145" width="10" height="10" fill="#10B981" />
                <rect x="245" y="75" width="10" height="10" fill="#10B981" />
              </svg>
              {/* Floating card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white p-4 shadow-none border-2 border-gray-900 flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center font-black text-xl">
                    T42
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">B2B ROUTE</div>
                    <div className="font-black text-gray-900 text-sm uppercase mt-1">WholeFoods Metro</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-500 text-xl">12M</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">ETA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing & Tax Widget */}
          <div className="bg-amber-50 p-6 border-l-8 border-amber-500">
            <h3 className="font-black uppercase tracking-widest text-amber-900 flex items-center gap-3 mb-6">
              <Printer className="w-5 h-5 stroke-[3]" /> Tax Automation
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <CheckCircle2 className="w-6 h-6 text-amber-500 stroke-[3]" />
                </div>
                <div>
                  <div className="font-black text-amber-900 text-sm uppercase">Invoice #TX-2024-991</div>
                  <div className="text-xs font-bold text-amber-700 mt-1 uppercase tracking-widest">Grand Hotel Group</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1">
                  <RefreshCw className="w-6 h-6 text-amber-500 stroke-[3] animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-amber-900 text-sm uppercase">Generating...</div>
                  <div className="text-xs font-bold text-amber-700 mt-1 uppercase tracking-widest">WholeFoods Metro</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
