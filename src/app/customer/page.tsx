import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CustomerShopPage() {
  const products = await prisma.product.findMany({
    include: { pricingTiers: true },
    orderBy: [{ poultryType: "asc" }, { basePrice: "desc" }],
  });

  // Group by poultry type
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

  const poultryColors: Record<string, string> = {
    CHICKEN: "from-[#D4A24E] to-[#F2D98D]",
    DUCK: "from-[#3498DB] to-[#5DADE2]",
    GOOSE: "from-[#2D7A4F] to-[#3DA065]",
    QUAIL: "from-[#E74C3C] to-[#EC7063]",
  };

  return (
    <div className="py-4 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search eggs by name, type, size..."
          className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4A24E]/30 focus:border-[#D4A24E]/50 transition-all-smooth"
        />
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {Object.entries(grouped).map(([type]) => (
          <button
            key={type}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full glass text-xs font-medium text-white/70 whitespace-nowrap hover:bg-white/10 transition-colors"
          >
            <span>{poultryEmoji[type]}</span>
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Product Sections */}
      {Object.entries(grouped).map(([type, items]) => (
        <section key={type}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{poultryEmoji[type]}</span>
            <h2 className="text-lg font-bold text-white">{type.charAt(0) + type.slice(1).toLowerCase()} Eggs</h2>
            <span className="text-xs text-white/30 ml-auto">{items.length} products</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {items.map((product) => {
              const consumerPrice = product.pricingTiers.find((t) => t.accountType === "CONSUMER");
              return (
                <Link href={`/customer/product/${product.id}`} key={product.id} className="block group">
                  <div className="glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-all-smooth">
                    {/* Product Image Placeholder */}
                    <div className={`h-28 bg-gradient-to-br ${poultryColors[product.poultryType]} flex items-center justify-center relative`}>
                      <span className="text-4xl opacity-80">{poultryEmoji[product.poultryType]}</span>
                      {product.stockQuantity < 1000 && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-red-500/90 text-white text-[9px] font-bold">
                          LOW
                        </span>
                      )}
                    </div>

                    <div className="p-3">
                      <p className="text-xs font-medium text-white truncate">{product.name}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{product.gradeSize} • {product.weightRange}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-bold text-[#D4A24E]">
                          ฿{(consumerPrice?.price ?? product.basePrice).toFixed(2)}
                        </p>
                        <button className="w-7 h-7 rounded-lg bg-[#D4A24E]/10 flex items-center justify-center text-[#D4A24E] text-sm hover:bg-[#D4A24E]/20 transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
