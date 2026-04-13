import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import EggIcon from "@mui/icons-material/Egg";
import PetsIcon from "@mui/icons-material/Pets";
import SubscribeButton from "./SubscribeButton";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { pricingTiers: true },
  });

  if (!product) return notFound();

  // For prototype, get the first customer
  const user = await prisma.user.findFirst({
    where: { role: "CUSTOMER" },
  });

  const poultryColors: Record<string, string> = {
    CHICKEN: "bg-blue-500 text-white",
    DUCK: "bg-emerald-500 text-white",
    GOOSE: "bg-amber-500 text-gray-900",
    QUAIL: "bg-purple-500 text-white",
  };

  const accountType = user?.accountType || "CONSUMER";
  const tierPrice = product.pricingTiers.find((t) => t.accountType === accountType);
  const price = tierPrice?.price ?? product.basePrice;

  const consumerPrice = product.pricingTiers.find((t) => t.accountType === "CONSUMER");
  const businessPrice = product.pricingTiers.find((t) => t.accountType === "FOOD_BUSINESS");
  const retailPrice = product.pricingTiers.find((t) => t.accountType === "RETAILER");

  return (
    <div className="py-8 space-y-8">
      {/* Back button */}
      <Link href="/customer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 hover:text-gray-900 transition-colors border-2 border-gray-200">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
        BACK TO SHOP
      </Link>

      {/* Product Image */}
      <div className={`h-56 border-4 border-gray-900 ${poultryColors[product.poultryType]} flex items-center justify-center relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        <span className="text-8xl flex items-center group-hover:scale-125 transition-transform duration-300">
          {product.poultryType === "CHICKEN" || product.poultryType === "DUCK" ? (
            <PetsIcon fontSize="inherit" />
          ) : (
            <EggIcon fontSize="inherit" />
          )}
        </span>
        <div className="absolute top-4 right-4 px-4 py-2 bg-gray-900 text-[10px] font-black text-white uppercase tracking-widest">
           {product.poultryType}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase leading-none">{product.name}</h1>
        <p className="text-sm font-bold text-gray-600 leading-relaxed uppercase tracking-wide">
          {product.description || "Premium quality eggs from our bio-secure closed-system farms. Graded according to international standards."}
        </p>
      </div>

      {/* Specifications */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Grade", value: product.gradeSize },
          { label: "Weight", value: product.weightRange },
          { label: "Inventory", value: `${product.stockQuantity.toLocaleString()}` },
        ].map((spec) => (
          <div key={spec.label} className="bg-gray-50 border-2 border-gray-200 p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">{spec.label}</p>
            <p className="text-sm font-black text-gray-900 uppercase">{spec.value}</p>
          </div>
        ))}
      </div>

      {/* Pricing by Account Type */}
      <div className="bg-white border-4 border-gray-900 p-6 space-y-6">
        <div className="flex items-center justify-between border-b-4 border-gray-100 pb-4">
           <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Price Tiers</h2>
           <span className="text-[10px] text-emerald-800 font-black uppercase tracking-widest bg-emerald-100 border-2 border-emerald-500 px-3 py-1">Active: {accountType}</span>
        </div>
        <div className="space-y-4">
          {[
            { label: "Consumer (B2C)", price: consumerPrice?.price ?? product.basePrice, color: "text-gray-900", active: accountType === "CONSUMER" },
            { label: "Food Business (B2B)", price: businessPrice?.price, color: "text-blue-600", discount: "15% OFF", active: accountType === "FOOD_BUSINESS" },
            { label: "Retailer (B2B)", price: retailPrice?.price, color: "text-purple-600", discount: "25% OFF", active: accountType === "RETAILER" },
          ].map((tier) => (
            <div key={tier.label} className={`flex items-center justify-between p-4 border-4 transition-all ${tier.active ? "border-emerald-500 bg-emerald-50" : "border-gray-100 bg-gray-50 opacity-60"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 ${tier.active ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest ${tier.active ? "text-gray-900" : "text-gray-500"}`}>{tier.label}</p>
                  {tier.discount && <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">{tier.discount}</p>}
                </div>
              </div>
              <p className={`text-xl font-black ${tier.active ? "text-emerald-600" : "text-gray-400"}`}>
                ฿{tier.price?.toFixed(2) ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4 pt-4">
        <button className="w-full py-5 bg-emerald-500 text-white font-black text-lg uppercase tracking-widest hover:bg-emerald-600 hover:scale-[1.02] transition-all">
          Direct Purchase — ฿{price.toFixed(2)}
        </button>
        
        {user && (
          <SubscribeButton 
            productId={product.id} 
            customerId={user.id} 
            productName={product.name} 
          />
        )}
      </div>
    </div>
  );
}
