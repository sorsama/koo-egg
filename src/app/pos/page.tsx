"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Product = {
  id: string;
  name: string;
  poultryType: string;
  gradeSize: string;
  weightRange: string;
  basePrice: number;
  stockQuantity: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === "ALL" || p.poultryType === selectedType;
    return matchSearch && matchType;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.id === productId
            ? { ...c, quantity: Math.max(0, c.quantity + delta) }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, c) => sum + c.product.basePrice * c.quantity, 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const processPayment = () => {
    const num = `POS-${Date.now().toString().slice(-6)}`;
    setReceiptNumber(num);
    setShowReceipt(true);
  };

  const clearAll = () => {
    setCart([]);
    setShowReceipt(false);
    setReceiptNumber("");
  };

  const poultryEmoji: Record<string, string> = {
    CHICKEN: "🐔",
    DUCK: "🦆",
    GOOSE: "🪿",
    QUAIL: "🐦",
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex">
      {/* Left Panel - Product Selection */}
      <div className="flex-1 flex flex-col p-6">
        {/* POS Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D7A4F] to-[#3DA065] flex items-center justify-center">
              <span className="text-sm font-black text-white">K</span>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">POS Terminal</h1>
              <p className="text-xs text-white/40">KOO Integrated Egg — Walk-in Sales</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#2D7A4F]/30"
          />
        </div>

        {/* Type Tabs */}
        <div className="flex gap-2 mb-4">
          {["ALL", "CHICKEN", "DUCK", "GOOSE", "QUAIL"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all-smooth ${
                selectedType === type
                  ? "bg-gradient-to-r from-[#2D7A4F] to-[#3DA065] text-white"
                  : "glass text-white/50 hover:text-white"
              }`}
            >
              {type === "ALL" ? "🥚 All" : `${poultryEmoji[type]} ${type.charAt(0) + type.slice(1).toLowerCase()}`}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="glass rounded-xl p-4 text-left hover:scale-[1.02] hover:bg-white/[0.06] transition-all-smooth group"
            >
              <div className="text-2xl mb-2">{poultryEmoji[product.poultryType] || "🥚"}</div>
              <p className="text-xs font-medium text-white truncate">{product.name}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{product.gradeSize} • {product.weightRange}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-[#3DA065]">฿{product.basePrice.toFixed(2)}</span>
                <span className="text-[10px] text-white/30">{product.stockQuantity.toLocaleString()} in stock</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Cart / Checkout */}
      <div className="w-96 bg-[#14142B] border-l border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Current Sale</h2>
          <p className="text-xs text-white/40">{cart.length} item(s) in cart</p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">🛒</p>
              <p className="text-sm text-white/30">Tap products to add</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{item.product.name}</p>
                  <p className="text-[10px] text-white/40">฿{item.product.basePrice.toFixed(2)} × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateCartQty(item.product.id, -1)}
                    className="w-7 h-7 rounded-lg bg-white/5 text-white/50 flex items-center justify-center text-xs hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    −
                  </button>
                  <span className="text-xs font-bold text-white w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQty(item.product.id, 1)}
                    className="w-7 h-7 rounded-lg bg-[#2D7A4F]/10 text-[#3DA065] flex items-center justify-center text-xs hover:bg-[#2D7A4F]/20 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-bold text-white w-16 text-right">
                  ฿{(item.product.basePrice * item.quantity).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="p-5 border-t border-white/5 space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/50">
              <span>Subtotal</span>
              <span>฿{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>VAT (7%)</span>
              <span>฿{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
              <span>Total</span>
              <span className="text-[#3DA065]">฿{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={clearAll}
              className="py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={processPayment}
              disabled={cart.length === 0}
              className="py-3 rounded-xl bg-gradient-to-r from-[#2D7A4F] to-[#3DA065] text-white text-sm font-bold hover:shadow-lg hover:shadow-[#2D7A4F]/20 transition-all-smooth disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Pay ฿{total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900">Payment Successful</h2>
            <p className="text-sm text-gray-500 mt-1">Receipt #{receiptNumber}</p>

            <div className="my-6 border-t border-dashed border-gray-200 pt-4 space-y-2 text-left">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.quantity}× {item.product.name.split(" - ")[0]}</span>
                  <span>฿{(item.product.basePrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>฿{total.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-4">KOO Integrated Egg Co., Ltd.</p>

            <button
              onClick={clearAll}
              className="w-full py-3 rounded-xl bg-[#2D7A4F] text-white font-medium"
            >
              New Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
