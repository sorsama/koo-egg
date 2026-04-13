"use client";

import { useState } from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import EggIcon from "@mui/icons-material/Egg";
import PetsIcon from "@mui/icons-material/Pets";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GPSTracker from "./GPSTracker";

type Order = {
  id: string;
  status: string;
  createdAt: Date;
  subtotal: number;
  trackingLat: number | null;
  items: any[];
  invoice: any | null;
};

export default function OrderList({ orders }: { orders: Order[] }) {
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="bg-white border-4 border-gray-900 p-12 text-center shadow-[8px_8px_0_0_#111827]">
          <p className="text-6xl mb-6 text-gray-300">
            <InventoryIcon fontSize="inherit" />
          </p>
          <p className="text-xl font-black text-gray-400 uppercase tracking-widest">No orders yet</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white border-4 border-gray-900 p-6 space-y-6 hover:border-blue-500 transition-colors group">
            {/* Order header */}
            <div className="flex items-center justify-between border-b-4 border-gray-100 pb-4">
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">#{order.id.slice(0, 8)}</p>
                <p className="text-sm font-black text-gray-900 mt-1 uppercase">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                order.status === "DELIVERED"
                  ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-500"
                  : order.status === "PROCESSING"
                  ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
                  : order.status === "CANCELLED"
                  ? "bg-red-100 text-red-800 border-2 border-red-500"
                  : order.status === "DELIVERING"
                  ? "bg-purple-100 text-purple-800 border-2 border-purple-500"
                  : "bg-amber-100 text-amber-800 border-2 border-amber-500"
              }`}>
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-gray-200 group-hover:border-blue-200 transition-colors">
                  <div className="w-12 h-12 bg-white border-2 border-gray-200 flex items-center justify-center text-blue-500">
                    {item.product.poultryType === "CHICKEN" || item.product.poultryType === "DUCK" ? (
                      <PetsIcon fontSize="small" />
                    ) : (
                      <EggIcon fontSize="small" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-900 uppercase leading-tight">{item.product.name}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Qty: {item.quantity} × ฿{item.priceAtTime.toFixed(2)}</p>
                  </div>
                  <p className="text-lg font-black text-blue-600">
                    ฿{(item.quantity * item.priceAtTime).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total & GPS */}
            <div className="flex items-center justify-between pt-4 border-t-4 border-gray-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total</span>
                <span className="text-2xl font-black text-gray-900 leading-none">฿{order.subtotal.toFixed(2)}</span>
              </div>
              
              {order.status === "DELIVERING" && (
                <button 
                  onClick={() => setTrackingOrderId(order.id)}
                  className="px-6 py-3 bg-purple-500 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-purple-600 transition-colors hover:scale-105"
                >
                  <LocationOnIcon fontSize="small" /> Track GPS
                </button>
              )}
            </div>

            {/* Invoice */}
            {order.invoice && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 border-l-8 border-blue-500 mt-4">
                <div className="text-blue-500">
                  <ReceiptIcon fontSize="medium" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">Tax Invoice</p>
                  <p className="text-sm font-black text-blue-900 uppercase">{order.invoice.invoiceNumber}</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-lg font-black text-blue-600">฿{order.invoice.total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {trackingOrderId && (
        <GPSTracker 
          orderId={trackingOrderId} 
          onClose={() => setTrackingOrderId(null)} 
        />
      )}
    </div>
  );
}
