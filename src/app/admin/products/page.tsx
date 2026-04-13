import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { pricingTiers: true },
    orderBy: [{ poultryType: "asc" }, { gradeSize: "asc" }],
  });

  const poultryEmoji: Record<string, string> = {
    CHICKEN: "🐔",
    DUCK: "🦆",
    GOOSE: "🪿",
    QUAIL: "🐦",
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Administration</h1>
          <p className="text-white/50 mt-1">L1:6 Product Administration — Manage details, images, and pricing</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#3498DB]/20 transition-all-smooth">
          + Add Product
        </button>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {products.map((product) => {
          const consumerPrice = product.pricingTiers.find((t) => t.accountType === "CONSUMER");
          const businessPrice = product.pricingTiers.find((t) => t.accountType === "FOOD_BUSINESS");
          const retailPrice = product.pricingTiers.find((t) => t.accountType === "RETAILER");

          return (
            <div key={product.id} className="glass rounded-2xl p-6 hover:scale-[1.01] transition-all-smooth group">
              {/* Product header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#D4A24E]/10 flex items-center justify-center text-2xl">
                    {poultryEmoji[product.poultryType] || "🥚"}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{product.name}</h3>
                    <p className="text-xs text-white/40">{product.gradeSize} • {product.weightRange}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 transition-all-smooth">
                  Edit
                </button>
              </div>

              {/* Pricing Tiers */}
              <div className="space-y-2 mb-4">
                <p className="text-xs text-white/30 uppercase tracking-wider">Pricing Tiers</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-green-500/5 p-2.5 text-center">
                    <p className="text-[10px] text-green-400/60">Consumer</p>
                    <p className="text-sm font-bold text-green-400">฿{consumerPrice?.price.toFixed(2) ?? product.basePrice.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-purple-500/5 p-2.5 text-center">
                    <p className="text-[10px] text-purple-400/60">Business</p>
                    <p className="text-sm font-bold text-purple-400">฿{businessPrice?.price.toFixed(2) ?? "—"}</p>
                  </div>
                  <div className="rounded-lg bg-blue-500/5 p-2.5 text-center">
                    <p className="text-[10px] text-blue-400/60">Retailer</p>
                    <p className="text-sm font-bold text-blue-400">฿{retailPrice?.price.toFixed(2) ?? "—"}</p>
                  </div>
                </div>
              </div>

              {/* Stock bar */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Stock: {product.stockQuantity.toLocaleString()}</span>
                <span className="text-white/30">ID: {product.id.slice(0, 8)}...</span>
              </div>
              <div className="mt-2 w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D4A24E] to-[#F2D98D]"
                  style={{ width: `${Math.min(100, (product.stockQuantity / 30000) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
