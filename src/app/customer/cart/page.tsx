"use client";

import Link from "next/link";
import { useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EggIcon from "@mui/icons-material/Egg";
import PetsIcon from "@mui/icons-material/Pets";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Simulated cart items for prototype
const initialCart = [
  { id: "1", name: "Chicken Egg - Jumbo (Size 0)", quantity: 30, price: 7.0, poultryType: "CHICKEN" },
  { id: "2", name: "Duck Egg - Large", quantity: 10, price: 8.0, poultryType: "DUCK" },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCart);
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const poultryIcon: Record<string, React.ReactNode> = {
    CHICKEN: <PetsIcon fontSize="medium" />,
    DUCK: <PetsIcon fontSize="medium" />,
    GOOSE: <PetsIcon fontSize="medium" />,
    QUAIL: <PetsIcon fontSize="medium" />,
  };

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white border-4 border-gray-900 p-12 text-center shadow-[8px_8px_0_0_#111827]">
          <p className="text-6xl mb-6 text-gray-300">
            <ShoppingCartIcon fontSize="inherit" />
          </p>
          <p className="text-xl font-black text-gray-400 uppercase tracking-widest">Cart is empty</p>
          <Link href="/customer" className="inline-block mt-8 px-6 py-4 bg-blue-500 text-white font-black uppercase tracking-widest hover:bg-blue-600 hover:scale-105 transition-all">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white border-4 border-gray-900 p-4 flex items-center gap-4 hover:border-blue-500 transition-colors group">
                <div className="w-14 h-14 bg-gray-100 flex items-center justify-center text-blue-500 border-2 border-gray-200 group-hover:scale-110 transition-transform">
                  {poultryIcon[item.poultryType] || <EggIcon fontSize="medium" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 uppercase leading-tight truncate">{item.name}</p>
                  <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">฿{item.price.toFixed(2)} / unit</p>
                </div>
                <div className="flex items-center border-2 border-gray-200 bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 font-black hover:bg-gray-200 hover:text-gray-900 transition-colors"
                  >
                    −
                  </button>
                  <span className="text-sm font-black text-gray-900 w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-blue-500 font-black hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-100 border-4 border-gray-900 p-6 space-y-4">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-black text-gray-500 uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-gray-900">฿{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-500 uppercase tracking-widest">
                <span>VAT (7%)</span>
                <span className="text-gray-900">฿{tax.toFixed(2)}</span>
              </div>
              <div className="border-t-4 border-gray-900 pt-4 flex justify-between text-2xl font-black text-gray-900 uppercase">
                <span>Total</span>
                <span className="text-emerald-600">฿{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full py-5 bg-emerald-500 text-white font-black text-lg tracking-widest uppercase hover:bg-emerald-600 hover:scale-[1.02] transition-all"
          >
            Checkout — ฿{total.toFixed(2)}
          </button>

          {/* Checkout Modal */}
          {showCheckout && (
            <div className="fixed inset-0 z-[100] bg-gray-900/80 flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white border-8 border-gray-900 p-8 space-y-6">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Payment</h2>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select payment method (Simulated)</p>

                <div className="space-y-4 pt-4">
                  {["Credit Card", "Bank Transfer", "Cash on Delivery"].map((method) => (
                    <button
                      key={method}
                      className="w-full p-4 border-4 border-gray-200 text-left text-sm font-black text-gray-600 uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 flex items-center gap-4 transition-colors"
                    >
                      {method === "Credit Card" ? (
                        <CreditCardIcon fontSize="medium" />
                      ) : method === "Bank Transfer" ? (
                        <AccountBalanceIcon fontSize="medium" />
                      ) : (
                        <PaymentsIcon fontSize="medium" />
                      )}
                      {method}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-6 border-t-4 border-gray-100">
                  <button
                    onClick={() => {
                      setShowCheckout(false);
                      setCartItems([]);
                      alert("Order placed successfully! (Simulated)");
                    }}
                    className="w-full py-4 bg-emerald-500 text-white font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                  >
                    Confirm Payment
                  </button>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full py-4 bg-gray-100 text-gray-500 font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
