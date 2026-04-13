import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ poultryType: "asc" }, { stockQuantity: "asc" }],
  });

  const grouped = products.reduce((acc, p) => {
    if (!acc[p.poultryType]) acc[p.poultryType] = [];
    acc[p.poultryType].push(p);
    return acc;
  }, {} as Record<string, typeof products>);

  const poultryEmoji: Record<string, string> = {
    CHICKEN: "🐔",
    DUCK: "🦆",
    GOOSE: "🪿",
    QUAIL: "🐦",
  };

  const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
          <p className="text-white/50 mt-1">L1:5 Stock Management — FIFO tracking</p>
        </div>
        <div className="glass rounded-2xl px-6 py-4">
          <p className="text-xs text-white/40">Total Stock</p>
          <p className="text-2xl font-bold text-[#D4A24E]">{totalStock.toLocaleString()} <span className="text-sm font-normal text-white/30">units</span></p>
        </div>
      </div>

      {/* FIFO indicator */}
      <div className="glass rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
          <span className="text-green-400 font-bold text-xs">FIFO</span>
        </div>
        <div>
          <p className="text-sm font-medium text-white">First-In, First-Out Enabled</p>
          <p className="text-xs text-white/40">Earliest expiry stock is prioritized for all dispatch and POS orders</p>
        </div>
      </div>

      {/* Inventory by type */}
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
            <span className="text-2xl">{poultryEmoji[type] || "🥚"}</span>
            <h2 className="text-lg font-semibold text-white">{type.charAt(0) + type.slice(1).toLowerCase()} Eggs</h2>
            <span className="ml-auto px-3 py-1 rounded-lg bg-white/5 text-white/50 text-xs">
              {items.length} variants
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-white/30 uppercase tracking-wider">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Grade</th>
                  <th className="px-6 py-3">Weight</th>
                  <th className="px-6 py-3">Base Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((product) => {
                  const stockLevel =
                    product.stockQuantity < 1000
                      ? "critical"
                      : product.stockQuantity < 3000
                      ? "low"
                      : "normal";
                  return (
                    <tr key={product.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">{product.name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">{product.gradeSize}</td>
                      <td className="px-6 py-4 text-sm text-white/60">{product.weightRange}</td>
                      <td className="px-6 py-4 text-sm text-[#D4A24E] font-medium">฿{product.basePrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                stockLevel === "critical"
                                  ? "bg-red-500"
                                  : stockLevel === "low"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(100, (product.stockQuantity / 30000) * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-white">{product.stockQuantity.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          stockLevel === "critical"
                            ? "bg-red-500/10 text-red-400"
                            : stockLevel === "low"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-green-500/10 text-green-400"
                        }`}>
                          {stockLevel === "critical" ? "Critical" : stockLevel === "low" ? "Low" : "Normal"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
