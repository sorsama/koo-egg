import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { pricingTiers: true },
  });

  if (!product) return notFound();

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

  const consumerPrice = product.pricingTiers.find((t) => t.accountType === "CONSUMER");
  const businessPrice = product.pricingTiers.find((t) => t.accountType === "FOOD_BUSINESS");
  const retailPrice = product.pricingTiers.find((t) => t.accountType === "RETAILER");

  return (
    <div className="py-4 space-y-6">
      {/* Back button */}
      <Link href="/customer" className="flex items-center gap-2 text-white/40 text-sm hover:text-white/60 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Back to Shop
      </Link>

      {/* Product Image */}
      <div className={`h-48 rounded-2xl bg-gradient-to-br ${poultryColors[product.poultryType]} flex items-center justify-center`}>
        <span className="text-7xl opacity-80">{poultryEmoji[product.poultryType]}</span>
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-xl font-bold text-white">{product.name}</h1>
        <p className="text-sm text-white/40 mt-1">{product.description}</p>
      </div>

      {/* Specifications */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Grade", value: product.gradeSize },
          { label: "Weight", value: product.weightRange },
          { label: "Stock", value: `${product.stockQuantity.toLocaleString()}` },
        ].map((spec) => (
          <div key={spec.label} className="glass rounded-xl p-3 text-center">
            <p className="text-[10px] text-white/30 uppercase">{spec.label}</p>
            <p className="text-sm font-bold text-white mt-1">{spec.value}</p>
          </div>
        ))}
      </div>

      {/* Pricing by Account Type */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Pricing by Account Type</h2>
        <div className="space-y-2">
          {[
            { label: "Consumer (B2C)", price: consumerPrice?.price ?? product.basePrice, color: "text-green-400", bg: "bg-green-500/5" },
            { label: "Food Business (B2B)", price: businessPrice?.price, color: "text-purple-400", bg: "bg-purple-500/5", discount: "15% off" },
            { label: "Retailer (B2B)", price: retailPrice?.price, color: "text-blue-400", bg: "bg-blue-500/5", discount: "25% off" },
          ].map((tier) => (
            <div key={tier.label} className={`flex items-center justify-between p-3 rounded-xl ${tier.bg}`}>
              <div>
                <p className="text-xs text-white/60">{tier.label}</p>
                {tier.discount && <p className="text-[10px] text-white/30">{tier.discount}</p>}
              </div>
              <p className={`text-lg font-bold ${tier.color}`}>
                ฿{tier.price?.toFixed(2) ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add to Cart */}
      <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4A24E] to-[#F2D98D] text-[#1A1A2E] font-bold text-sm hover:shadow-lg hover:shadow-[#D4A24E]/20 transition-all-smooth">
        Add to Cart — ฿{(consumerPrice?.price ?? product.basePrice).toFixed(2)}
      </button>
    </div>
  );
}
