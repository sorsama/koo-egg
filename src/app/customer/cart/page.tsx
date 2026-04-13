"use client";

import Link from "next/link";
import { useState } from "react";

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

  const poultryEmoji: Record<string, string> = {
    CHICKEN: "🐔",
    DUCK: "🦆",
    GOOSE: "🪿",
    QUAIL: "🐦",
  };

  return (
    <div className="py-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">🛒</p>
          <p className="text-white/50">Your cart is empty</p>
          <Link href="/customer" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#D4A24E] text-[#1A1A2E] text-sm font-medium">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#D4A24E]/10 flex items-center justify-center text-2xl">
                  {poultryEmoji[item.poultryType] || "🥚"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-xs text-[#D4A24E]">฿{item.price.toFixed(2)} / unit</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-lg bg-white/5 text-white/50 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold text-white w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-lg bg-[#D4A24E]/10 text-[#D4A24E] flex items-center justify-center hover:bg-[#D4A24E]/20 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span>฿{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>VAT (7%)</span>
                <span>฿{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold">
                <span>Total</span>
                <span className="text-[#D4A24E]">฿{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4A24E] to-[#F2D98D] text-[#1A1A2E] font-bold text-sm hover:shadow-lg hover:shadow-[#D4A24E]/20 transition-all-smooth"
          >
            Proceed to Checkout — ฿{total.toFixed(2)}
          </button>

          {/* Checkout Modal */}
          {showCheckout && (
            <div className="fixed inset-0 z-[100] bg-black/60 flex items-end justify-center">
              <div className="w-full max-w-md bg-[#1A1A2E] rounded-t-3xl p-6 space-y-4 animate-slide-up">
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />
                <h2 className="text-lg font-bold text-white">Payment (Simulated)</h2>

                <div className="space-y-3">
                  {["Credit Card", "Bank Transfer", "Cash on Delivery"].map((method) => (
                    <button
                      key={method}
                      className="w-full px-4 py-3 rounded-xl glass text-left text-sm text-white/70 hover:bg-white/10 transition-colors"
                    >
                      {method === "Credit Card" ? "💳" : method === "Bank Transfer" ? "🏦" : "💵"} {method}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setShowCheckout(false);
                    setCartItems([]);
                    alert("✅ Order placed successfully! (Simulated)");
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2D7A4F] to-[#3DA065] text-white font-bold text-sm"
                >
                  Confirm Payment
                </button>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-full py-3 rounded-xl text-white/40 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
