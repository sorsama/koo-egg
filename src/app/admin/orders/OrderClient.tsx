"use client";

import { useState } from "react";
import { Search, MapPin, CheckCircle2, RefreshCw, PencilLine, Printer, Edit, Bell, Settings, Plus } from "lucide-react";
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
      alert("Order added successfully!");
    } catch (err: any) {
      alert(err.message);
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
    <div className="bg-[#F8F9FA] min-h-screen text-slate-800 p-8 font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-[400px]">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search orders, customers, or tracking IDs..." 
            className="w-full bg-slate-200/50 border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            FIFO ENABLED
          </div>
          <button className="flex items-center gap-2 bg-emerald-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-900 transition">
            <Plus className="w-4 h-4" /> Add Stock
          </button>
          <div className="flex gap-3 text-slate-500">
            <Bell className="w-5 h-5 cursor-pointer hover:text-slate-700" />
            <Settings className="w-5 h-5 cursor-pointer hover:text-slate-700" />
          </div>
        </div>
      </div>

      {/* Main Title Area */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Order Fulfillment</h1>
          <p className="text-slate-500 mt-2">Real-time logistics and dispatch management for KOO Integrated Egg Co.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-200/80 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-300 transition">
            <Printer className="w-5 h-5" /> Batch Print Labels
          </button>
          <button className="flex items-center gap-2 bg-emerald-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-950 transition">
            <Edit className="w-5 h-5" /> Manual Entry (FR20)
          </button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Main Queue) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Queue Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                  </div>
                  Active Delivery Queue
                </h2>
                <p className="text-xs text-slate-500 font-semibold tracking-wider mt-1 uppercase">STRICT FIRST-IN, FIRST-OUT (FIFO) PRIORITIZATION</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">Processing: {orders.filter(o => o.status === 'PROCESSING').length || 12}</span>
                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">Dispatched: {orders.filter(o => o.status === 'DELIVERED').length || 8}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-3 font-medium">QUEUE # / ID</th>
                    <th className="pb-3 font-medium">TIER / CUSTOMER</th>
                    <th className="pb-3 font-medium">PRODUCT DETAILS</th>
                    <th className="pb-3 font-medium">AMOUNT</th>
                    <th className="pb-3 font-medium">DOCUMENT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((order, idx) => (
                    <tr key={order.id} className="hover:bg-slate-50/50">
                      <td className="py-4 align-top">
                        <div className="flex gap-3">
                          <span className="text-amber-500 font-bold mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                          <div>
                            <div className="font-semibold text-slate-900">#{order.id.slice(0, 8).toUpperCase()}</div>
                            <div className="text-xs text-emerald-500 font-medium mt-1">FIFO Rank: {idx === 0 ? 'High' : idx === 1 ? 'Med' : 'Low'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 align-top">
                        <div className="font-bold text-slate-900">{order.customer.fullname}</div>
                        <div className="mt-1 flex items-center gap-1">
                           <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              order.customer.accountType === "FOOD_BUSINESS" ? "bg-blue-100 text-blue-700" :
                              order.customer.accountType === "RETAILER" ? "bg-green-100 text-green-700" :
                              "bg-slate-100 text-slate-700"
                           }`}>
                             {order.customer.accountType || "DIRECT CONSUMER"}
                           </span>
                        </div>
                      </td>
                      <td className="py-4 align-top text-sm text-slate-600">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-1 mb-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                             {item.quantity}x {item.product.name}
                          </div>
                        ))}
                      </td>
                      <td className="py-4 align-top font-bold text-slate-900">
                        ${order.subtotal.toFixed(2)}
                      </td>
                      <td className="py-4 align-top">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <Printer className="w-4 h-4 text-slate-400" /> 
                          {order.invoice ? "Tax Invoice" : "Receipt"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Offline Sale & Walk-in Entry Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 text-slate-50 opacity-50">
              <PencilLine className="w-48 h-48" />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Settings className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Offline Sale & Walk-in Entry</h3>
                <p className="text-sm text-slate-500">Auto-aligns with next available FIFO stock batch.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 relative z-10">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Customer / Walk-in Name</label>
                <input 
                  required
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Name or Buyer Reference" 
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none font-medium placeholder:font-normal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Quantity (Units)</label>
                <input 
                  required
                  type="number" 
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Unit Price (฿)</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Product Standard (Thai Size)</label>
                <select 
                  required
                  value={productId}
                  onChange={handleProductChange}
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none font-medium appearance-none"
                >
                  <option value="" disabled>Select Product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex items-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-emerald-800 text-white rounded-xl px-4 py-3 font-bold hover:bg-emerald-900 transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          
          {/* Map Tracking Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Fleet & Dispatch Tracking
              </h3>
              <span className="text-xs text-emerald-600 font-bold cursor-pointer hover:underline">Open Map</span>
            </div>
            
            {/* Map Mockup Area */}
            <div className="h-48 bg-slate-200 relative">
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #94a3b8 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
              {/* Route line simulation */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M50,150 Q100,50 150,100 T250,80" fill="none" stroke="#059669" strokeWidth="4" strokeDasharray="6 6" />
                <circle cx="50" cy="150" r="6" fill="#059669" />
                <circle cx="250" cy="80" r="6" fill="#059669" />
              </svg>
              {/* Floating card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-lg flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-emerald-900 rounded-lg flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">TRUCK #42 - B2B ROUTE</div>
                    <div className="font-bold text-slate-900 text-sm">WholeFoods Metro Delivery</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">12 min</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">ETA</div>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                <span>Daily Capacity</span>
                <span>8 of 12 Trucks Active</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{width: '66%'}}></div>
              </div>
            </div>
          </div>

          {/* Billing & Tax Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold flex items-center gap-2 mb-6">
              <Printer className="w-5 h-5" /> Billing & Tax Automation
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Tax Invoice #TX-2024-991</div>
                  <div className="text-xs text-slate-500 mt-0.5">Validated for <span className="font-bold">Grand Hotel Group</span></div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">2 MINUTES AGO</div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1">
                  <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-sm">Generating Tax Invoice</div>
                  <div className="text-xs text-slate-500 mt-0.5">Processing <span className="font-bold">WholeFoods Metro</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                    <div className="bg-slate-800 h-1.5 rounded-full w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
              View Billing Dashboard
            </button>
          </div>

          {/* Available to Ship Widget */}
          <div className="bg-emerald-950 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-900/50 rounded-full blur-xl"></div>
            <div className="absolute right-4 bottom-4 w-20 h-20 border-[16px] border-emerald-900/30 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="text-xs font-bold tracking-wider text-emerald-400 uppercase flex items-center justify-between mb-2">
                AVAILABLE TO SHIP
                <span className="bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded text-[10px]">FIFO ACTIVE</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tighter">{totalStock.toLocaleString()}</span>
                <span className="text-emerald-400 font-bold">EGGS</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-200 font-medium">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                Priority: Earliest Expiry First
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
