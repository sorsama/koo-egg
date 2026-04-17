"use client";

import { useState, useTransition } from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import EggIcon from "@mui/icons-material/Egg";
import PetsIcon from "@mui/icons-material/Pets";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GPSTracker from "./GPSTracker";
import { cancelOrder } from "./actions";

type OrderItem = {
  id: string;
  quantity: number;
  priceAtTime: number;
  product: { name: string; poultryType: string };
};

type Order = {
  id: string;
  status: string;
  createdAt: Date;
  subtotal: number;
  trackingLat: number | null;
  trackingLng: number | null;
  cancelReason: string | null;
  paymentMethod: string | null;
  items: OrderItem[];
  invoice: { invoiceNumber: string; total: number } | null;
};

const CANCEL_REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a better price",
  "Delivery too slow",
  "Other",
];

const CANCELLABLE = new Set(["PENDING", "CONFIRMED"]);
const TRACKABLE = new Set(["CONFIRMED", "PROCESSING", "DELIVERING"]);

export default function OrderList({ orders }: { orders: Order[] }) {
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="bg-white border-4 border-gray-900 p-12 text-center">
          <p className="text-6xl mb-6 text-gray-300">
            <InventoryIcon fontSize="inherit" />
          </p>
          <p className="text-xl font-black text-gray-400 uppercase tracking-widest">No orders yet</p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border-4 border-gray-900 p-6 space-y-6 hover:border-blue-500 transition-colors group"
          >
            <div className="flex items-center justify-between border-b-4 border-gray-100 pb-4">
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">#{order.id.slice(0, 8)}</p>
                <p className="text-sm font-black text-gray-900 mt-1 uppercase">
                  {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                {order.paymentMethod ? (
                  <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">
                    Paid via {order.paymentMethod.replace("_", " ")}
                  </p>
                ) : null}
              </div>
              <span
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                  order.status === "DELIVERED"
                    ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-500"
                    : order.status === "PROCESSING" || order.status === "CONFIRMED"
                    ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
                    : order.status === "CANCELLED"
                    ? "bg-red-100 text-red-800 border-2 border-red-500"
                    : order.status === "DELIVERING"
                    ? "bg-purple-100 text-purple-800 border-2 border-purple-500"
                    : "bg-amber-100 text-amber-800 border-2 border-amber-500"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-gray-200 group-hover:border-blue-200 transition-colors"
                >
                  <div className="w-12 h-12 bg-white border-2 border-gray-200 flex items-center justify-center text-blue-500">
                    {item.product.poultryType === "CHICKEN" || item.product.poultryType === "DUCK" ? (
                      <PetsIcon fontSize="small" />
                    ) : (
                      <EggIcon fontSize="small" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-900 uppercase leading-tight">{item.product.name}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                      Qty: {item.quantity} × ฿{item.priceAtTime.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-lg font-black text-blue-600">
                    ฿{(item.quantity * item.priceAtTime).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t-4 border-gray-100 gap-3 flex-wrap">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total</span>
                <span className="text-2xl font-black text-gray-900 leading-none">฿{order.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-3">
                {TRACKABLE.has(order.status) && (
                  <button
                    onClick={() => setTrackingOrder(order)}
                    className="px-6 py-3 bg-purple-500 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-purple-600"
                  >
                    <LocationOnIcon fontSize="small" /> Track Order
                  </button>
                )}
                {CANCELLABLE.has(order.status) && (
                  <button
                    onClick={() => setCancelOrderId(order.id)}
                    className="px-6 py-3 bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {order.status === "CANCELLED" && order.cancelReason ? (
              <div className="p-3 bg-red-50 border-l-8 border-red-500 text-[11px] font-bold uppercase tracking-widest text-red-900">
                Reason: {order.cancelReason}
              </div>
            ) : null}

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

      {trackingOrder && (
        <GPSTracker
          orderId={trackingOrder.id}
          orderStatus={trackingOrder.status}
          trackingLat={trackingOrder.trackingLat}
          trackingLng={trackingOrder.trackingLng}
          onClose={() => setTrackingOrder(null)}
        />
      )}
      {cancelOrderId && (
        <CancelOrderModal orderId={cancelOrderId} onClose={() => setCancelOrderId(null)} />
      )}
    </div>
  );
}

function CancelOrderModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [custom, setCustom] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    const finalReason = reason === "Other" && custom.trim() ? `Other — ${custom.trim()}` : reason;
    startTransition(async () => {
      try {
        await cancelOrder(orderId, finalReason);
        onClose();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Cancel failed");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-8 border-gray-900 p-8 space-y-5 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 font-bold">
          ✕
        </button>
        <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">Cancel Order</h2>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
          Stock will be restored. Please let us know why.
        </p>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-900">Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border-4 border-gray-900 px-3 py-3 font-bold bg-white"
          >
            {CANCEL_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {reason === "Other" ? (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-900">Details</label>
            <textarea
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              rows={3}
              className="w-full border-4 border-gray-900 px-3 py-3 font-bold"
            />
          </div>
        ) : null}

        <div className="flex gap-3 pt-3">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-100 font-black uppercase tracking-widest text-xs hover:bg-gray-200">
            Keep Order
          </button>
          <button
            onClick={submit}
            disabled={isPending}
            className="flex-1 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 disabled:opacity-50"
          >
            {isPending ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
