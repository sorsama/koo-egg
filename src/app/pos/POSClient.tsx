"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import EggIcon from "@mui/icons-material/Egg";
import PetsIcon from "@mui/icons-material/Pets";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { completeSale } from "./actions";

type Product = {
  id: string;
  name: string;
  poultryType: string;
  gradeSize: string;
  weightRange: string;
  basePrice: number;
  stockQuantity: number;
};

type CartItem = { product: Product; quantity: number };

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "CREDIT_CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Transfer" },
  { value: "QR_PROMPTPAY", label: "QR" },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

export default function POSClient({
  products,
  operatorName,
}: {
  products: Product[];
  operatorName: string;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [receipt, setReceipt] = useState<{
    invoiceNumber: string;
    total: number;
    items: CartItem[];
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchType = selectedType === "ALL" || p.poultryType === selectedType;
        return matchSearch && matchType;
      }),
    [products, search, selectedType]
  );

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) => (c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.product.id === productId ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, c) => sum + c.product.basePrice * c.quantity, 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const processPayment = () => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await completeSale(
          cart.map((c) => ({ productId: c.product.id, quantity: c.quantity })),
          paymentMethod
        );
        setReceipt({ invoiceNumber: result.invoiceNumber, total: result.total, items: cart });
        setCart([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment failed");
      }
    });
  };

  const clearAll = () => {
    setCart([]);
    setReceipt(null);
    setError(null);
  };

  const poultryIcon: Record<string, React.ReactNode> = {
    CHICKEN: <PetsIcon fontSize="inherit" />,
    DUCK: <PetsIcon fontSize="inherit" />,
    GOOSE: <PetsIcon fontSize="inherit" />,
    QUAIL: <PetsIcon fontSize="inherit" />,
  };

  return (
    <div className="h-screen bg-gray-50 flex font-sans overflow-hidden">
      <div className="flex-1 flex flex-col h-full bg-white relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(#E5E7EB 2px, transparent 2px)`, backgroundSize: "32px 32px" }}
        />

        <div className="flex items-center justify-between p-6 border-b-4 border-gray-900 bg-white relative z-10">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="w-14 h-14 bg-emerald-500 text-white flex items-center justify-center font-black text-xl hover:scale-105 transition-transform">
              K
            </Link>
            <div>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">POS Terminal</h1>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                Operator: {operatorName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-100 border-2 border-emerald-500">
              <div className="w-3 h-3 bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">Online</span>
            </div>
            <a
              href="/logout"
              className="px-4 py-2 bg-gray-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black"
            >
              Log Out
            </a>
          </div>
        </div>

        <div className="p-6 pb-0 relative z-10 bg-white">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="SEARCH PRODUCTS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-6 py-4 bg-gray-100 border-none text-gray-900 text-sm font-black uppercase tracking-widest placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500 transition-shadow"
            />
          </div>

          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {["ALL", "CHICKEN", "DUCK", "GOOSE", "QUAIL"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center gap-3 whitespace-nowrap ${
                  selectedType === type
                    ? "bg-emerald-500 text-white border-2 border-emerald-500 scale-105"
                    : "bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-900 hover:text-gray-900"
                }`}
              >
                {type === "ALL" ? (
                  <>
                    <EggIcon fontSize="small" /> All
                  </>
                ) : (
                  <>
                    {poultryIcon[type]} {type}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-0 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stockQuantity <= 0}
                className="bg-white border-4 border-gray-100 p-6 text-left hover:border-emerald-500 hover:scale-[1.02] transition-all duration-200 group flex flex-col h-full disabled:opacity-50 disabled:hover:scale-100"
              >
                <div className="text-4xl mb-4 text-emerald-500 group-hover:scale-110 transition-transform origin-left">
                  {poultryIcon[product.poultryType] || <EggIcon fontSize="inherit" />}
                </div>
                <p className="text-base font-black text-gray-900 uppercase tracking-tight leading-tight">{product.name}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">
                  {product.gradeSize} • {product.weightRange}
                </p>

                <div className="mt-auto pt-6 w-full">
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-black text-emerald-600">฿{product.basePrice.toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {product.stockQuantity.toLocaleString()} in stock
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-[450px] bg-gray-50 border-l-4 border-gray-900 flex flex-col h-full relative z-20">
        <div className="p-6 border-b-4 border-gray-200 bg-white">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Current Sale</h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{cart.length} item(s) in cart</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30">
              <div className="text-6xl mb-6 text-gray-900">
                <ShoppingCartIcon fontSize="inherit" />
              </div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Tap products to add</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white border-2 border-gray-200 p-4 flex flex-col gap-4 relative group hover:border-gray-400 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-black text-gray-900 uppercase leading-tight">{item.product.name}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                      ฿{item.product.basePrice.toFixed(2)} each
                    </p>
                  </div>
                  <p className="text-lg font-black text-emerald-600">
                    ฿{(item.product.basePrice * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t-2 border-gray-100 pt-4">
                  <div className="flex items-center border-2 border-gray-200 bg-gray-50">
                    <button
                      onClick={() => updateCartQty(item.product.id, -1)}
                      className="w-10 h-10 flex items-center justify-center text-lg font-black text-gray-600 hover:bg-gray-200"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.product.id, 1)}
                      className="w-10 h-10 flex items-center justify-center text-lg font-black text-emerald-600 hover:bg-emerald-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-white border-t-4 border-gray-900 space-y-5">
          <div className="grid grid-cols-4 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setPaymentMethod(m.value)}
                className={`py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-colors ${
                  paymentMethod === m.value
                    ? "bg-emerald-500 text-white border-emerald-600"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-gray-900">฿{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
              <span>VAT (7%)</span>
              <span className="text-gray-900">฿{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-gray-900 uppercase pt-4 border-t-4 border-gray-100">
              <span>Total</span>
              <span className="text-emerald-600">฿{total.toFixed(2)}</span>
            </div>
          </div>

          {error ? (
            <div className="p-3 bg-red-100 border-2 border-red-500 text-red-900 text-[11px] font-black uppercase tracking-widest">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={clearAll}
              className="py-4 bg-gray-100 text-gray-500 font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              onClick={processPayment}
              disabled={cart.length === 0 || isPending}
              className="py-4 bg-emerald-500 text-white font-black uppercase tracking-widest hover:bg-emerald-600 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isPending ? "Processing..." : "Pay"}
            </button>
          </div>
        </div>
      </div>

      {receipt && (
        <div className="fixed inset-0 z-50 bg-gray-900/80 flex items-center justify-center p-4">
          <div className="bg-white p-10 max-w-md w-full border-8 border-gray-900 relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500 flex items-center justify-center text-white translate-x-1/3 -translate-y-1/3 rotate-12">
              <CheckCircleIcon fontSize="large" />
            </div>

            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">Paid</h2>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Invoice {receipt.invoiceNumber}</p>

            <div className="my-8 border-t-4 border-b-4 border-gray-100 py-6 space-y-4">
              {receipt.items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm font-bold text-gray-700 uppercase">
                  <span>
                    {item.quantity}× {item.product.name.split(" - ")[0]}
                  </span>
                  <span className="text-gray-900">฿{(item.product.basePrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-black text-2xl text-gray-900 uppercase mb-8">
              <span>Total</span>
              <span className="text-emerald-600">฿{receipt.total.toFixed(2)}</span>
            </div>

            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center">
              KOO Integrated Egg Co., Ltd.
            </p>

            <button
              onClick={clearAll}
              className="w-full py-4 bg-gray-900 text-white font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors"
            >
              New Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
