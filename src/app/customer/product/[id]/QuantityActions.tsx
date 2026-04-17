"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addItem } from "../../cart/actions";

type Props = {
  productId: string;
  unitPrice: number;
  stockQuantity: number;
};

export default function QuantityActions({ productId, unitPrice, stockQuantity }: Props) {
  const outOfStock = stockQuantity <= 0;
  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const clamp = (n: number) => Math.max(1, Math.min(stockQuantity || 1, Math.floor(n)));

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    if (!Number.isFinite(raw)) return setQty(1);
    setQty(clamp(raw));
  };

  const run = (after: "stay" | "cart") =>
    startTransition(async () => {
      try {
        await addItem(productId, qty);
        if (after === "cart") router.push("/customer/cart");
      } catch (err) {
        alert(err instanceof Error ? err.message : "Add failed");
      }
    });

  const lineTotal = qty * unitPrice;

  return (
    <div className="space-y-4 pt-4">
      <div className="bg-white border-4 border-gray-900 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Quantity</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {stockQuantity.toLocaleString()} in stock
          </p>
        </div>
        <div className="flex items-stretch gap-0 border-4 border-gray-900">
          <button
            type="button"
            disabled={outOfStock || qty <= 1 || isPending}
            onClick={() => setQty((q) => clamp(q - 1))}
            className="w-14 text-2xl font-black bg-gray-100 hover:bg-gray-900 hover:text-white disabled:opacity-40 disabled:hover:bg-gray-100 disabled:hover:text-gray-900"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={stockQuantity || 1}
            value={qty}
            onChange={handleInput}
            disabled={outOfStock || isPending}
            className="flex-1 text-center text-2xl font-black bg-white focus:outline-none focus:bg-blue-50"
          />
          <button
            type="button"
            disabled={outOfStock || qty >= stockQuantity || isPending}
            onClick={() => setQty((q) => clamp(q + 1))}
            className="w-14 text-2xl font-black bg-gray-100 hover:bg-gray-900 hover:text-white disabled:opacity-40 disabled:hover:bg-gray-100 disabled:hover:text-gray-900"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <div className="flex items-end justify-between pt-2 border-t-2 border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Line total</p>
          <p className="text-2xl font-black text-gray-900 tabular-nums">฿{lineTotal.toFixed(2)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => run("cart")}
        disabled={outOfStock || isPending}
        className="w-full py-5 bg-emerald-500 text-white font-black text-lg uppercase tracking-widest hover:bg-emerald-600 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
      >
        {outOfStock ? "Out of Stock" : isPending ? "Adding…" : `Buy ${qty} Now — ฿${lineTotal.toFixed(2)}`}
      </button>
      <button
        type="button"
        onClick={() => run("stay")}
        disabled={outOfStock || isPending}
        className="w-full py-4 bg-white border-4 border-gray-900 text-gray-900 font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-50"
      >
        {isPending ? "Adding…" : `Add ${qty} to Cart`}
      </button>
    </div>
  );
}
