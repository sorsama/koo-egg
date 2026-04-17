import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EggIcon from "@mui/icons-material/Egg";
import PetsIcon from "@mui/icons-material/Pets";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { checkout, removeItem, updateQuantity } from "./actions";

export const dynamic = "force-dynamic";

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash on Delivery" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "QR_PROMPTPAY", label: "QR PromptPay" },
];

export default async function CartPage() {
  const session = await requireCustomer();
  const cart = await getCart();
  const accountType = session.accountType || "CONSUMER";

  const productIds = cart.map((c) => c.productId);
  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { pricingTiers: true },
      })
    : [];

  const items = cart
    .map((ci) => {
      const prod = products.find((p) => p.id === ci.productId);
      if (!prod) return null;
      const tier = prod.pricingTiers.find((t) => t.accountType === accountType);
      const unitPrice = tier?.price ?? prod.basePrice;
      return {
        productId: prod.id,
        name: prod.name,
        poultryType: prod.poultryType,
        unitPrice,
        quantity: ci.quantity,
        lineTotal: unitPrice * ci.quantity,
        stockQuantity: prod.stockQuantity,
        archived: prod.isArchived,
      };
    })
    .filter(Boolean) as Array<{
    productId: string;
    name: string;
    poultryType: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    stockQuantity: number;
    archived: boolean;
  }>;

  const subtotal = items.reduce((sum, it) => sum + it.lineTotal, 0);
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  async function updateAction(formData: FormData) {
    "use server";
    const productId = String(formData.get("productId") ?? "");
    const quantity = parseInt(String(formData.get("quantity") ?? "0"), 10);
    await updateQuantity(productId, quantity);
  }

  async function removeAction(formData: FormData) {
    "use server";
    const productId = String(formData.get("productId") ?? "");
    await removeItem(productId);
  }

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="bg-white border-4 border-gray-900 p-12 text-center">
          <p className="text-6xl mb-6 text-gray-300">
            <ShoppingCartIcon fontSize="inherit" />
          </p>
          <p className="text-xl font-black text-gray-400 uppercase tracking-widest">Cart is empty</p>
          <Link
            href="/customer"
            className="inline-block mt-8 px-6 py-4 bg-blue-500 text-white font-black uppercase tracking-widest hover:bg-blue-600 hover:scale-105 transition-all"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white border-4 border-gray-900 p-4 flex items-center gap-4 hover:border-blue-500 transition-colors group"
              >
                <div className="w-14 h-14 bg-gray-100 flex items-center justify-center text-blue-500 border-2 border-gray-200">
                  {item.poultryType === "CHICKEN" || item.poultryType === "DUCK" ? (
                    <PetsIcon fontSize="medium" />
                  ) : (
                    <EggIcon fontSize="medium" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 uppercase leading-tight truncate">{item.name}</p>
                  <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">
                    ฿{item.unitPrice.toFixed(2)} / unit · {item.quantity} × = ฿{item.lineTotal.toFixed(2)}
                  </p>
                  {item.archived ? (
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">
                      Product no longer available
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center border-2 border-gray-200 bg-gray-50">
                  <form action={updateAction}>
                    <input type="hidden" name="productId" value={item.productId} />
                    <input type="hidden" name="quantity" value={item.quantity - 1} />
                    <button
                      type="submit"
                      className="w-8 h-8 flex items-center justify-center text-gray-500 font-black hover:bg-gray-200 hover:text-gray-900"
                    >
                      −
                    </button>
                  </form>
                  <span className="text-sm font-black text-gray-900 w-8 text-center">{item.quantity}</span>
                  <form action={updateAction}>
                    <input type="hidden" name="productId" value={item.productId} />
                    <input type="hidden" name="quantity" value={item.quantity + 1} />
                    <button
                      type="submit"
                      disabled={item.quantity >= item.stockQuantity}
                      className="w-8 h-8 flex items-center justify-center text-blue-500 font-black hover:bg-blue-100 hover:text-blue-700 disabled:opacity-40"
                    >
                      +
                    </button>
                  </form>
                </div>
                <form action={removeAction}>
                  <input type="hidden" name="productId" value={item.productId} />
                  <button
                    type="submit"
                    aria-label="Remove"
                    className="w-8 h-8 flex items-center justify-center bg-red-500 text-white font-black hover:bg-red-600"
                  >
                    ×
                  </button>
                </form>
              </div>
            ))}
          </div>

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

          <form action={checkout} className="bg-white border-4 border-gray-900 p-6 space-y-4">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((m, idx) => (
                <label
                  key={m.value}
                  className="flex items-center gap-3 p-4 border-4 border-gray-200 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.value}
                    defaultChecked={idx === 0}
                    required
                    className="accent-blue-500"
                  />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-900">{m.label}</span>
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="w-full py-5 bg-emerald-500 text-white font-black text-lg tracking-widest uppercase hover:bg-emerald-600"
            >
              Confirm Payment — ฿{total.toFixed(2)}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
