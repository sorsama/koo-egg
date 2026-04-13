import { prisma } from "@/lib/prisma";
import Link from "next/link";
import EggIcon from "@mui/icons-material/Egg";
import PetsIcon from "@mui/icons-material/Pets";

export default async function CustomerShopPage() {
  // For prototype, show the first customer's pricing
  const user = await prisma.user.findFirst({
    where: { role: "CUSTOMER" },
  });

  const accountType = user?.accountType || "CONSUMER";

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

  const poultryColors: Record<string, string> = {
    CHICKEN: "bg-blue-500",
    DUCK: "bg-emerald-500",
    GOOSE: "bg-amber-500",
    QUAIL: "bg-purple-500",
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header with Account Type */}
      <div className="flex items-center justify-between bg-white border-4 border-gray-900 p-6">
         <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Catalog</h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Live Inventory</p>
         </div>
         <div className="flex flex-col items-end">
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${
               accountType === "FOOD_BUSINESS" ? "bg-blue-100 border-blue-500 text-blue-800" :
               accountType === "RETAILER" ? "bg-emerald-100 border-emerald-500 text-emerald-800" :
               "bg-amber-100 border-amber-500 text-amber-800"
            }`}>
               {accountType.replace("_", " ")}
            </span>
            <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest">Tier Pricing</p>
         </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="SEARCH EGGS..."
          className="w-full px-6 py-4 bg-white border-4 border-gray-900 text-gray-900 text-sm font-black uppercase tracking-widest placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors rounded-none"
        />
        <svg className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 stroke-[3]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {Object.entries(grouped).map(([type]) => (
          <button
            key={type}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-xs font-black text-gray-600 whitespace-nowrap hover:border-gray-900 hover:text-gray-900 transition-all uppercase tracking-widest rounded-none"
          >
            <span className="flex items-center opacity-50">
              {type === "CHICKEN" || type === "DUCK" ? (
                <PetsIcon fontSize="small" />
              ) : (
                <EggIcon fontSize="small" />
              )}
            </span>
            {type}
          </button>
        ))}
      </div>

      {/* Product Sections */}
      {Object.entries(grouped).map(([type, items]) => (
        <section key={type} className="space-y-6">
          <div className="flex items-center gap-4 border-l-8 border-gray-900 pl-4 py-2">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{type} EGGS</h2>
            <div className="h-1 flex-1 bg-gray-200" />
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{items.length} VARIANTS</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {items.map((product) => {
              const tierPrice = product.pricingTiers.find((t) => t.accountType === accountType);
              const price = tierPrice?.price ?? product.basePrice;
              const isDiscounted = price < product.basePrice;

              return (
                <Link href={`/customer/product/${product.id}`} key={product.id} className="block group">
                  <div className="bg-white border-4 border-gray-900 overflow-hidden hover:scale-105 transition-transform duration-200 relative flex flex-col h-full cursor-pointer">
                    
                    {/* Product Image Placeholder */}
                    <div className={`h-32 ${poultryColors[product.poultryType]} flex items-center justify-center relative overflow-hidden border-b-4 border-gray-900`}>
                      <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                      <span className="text-6xl text-white flex items-center transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300">
                        {product.poultryType === "CHICKEN" || product.poultryType === "DUCK" ? (
                          <PetsIcon fontSize="inherit" />
                        ) : (
                          <EggIcon fontSize="inherit" />
                        )}
                      </span>
                      
                      <div className="absolute top-2 left-2 flex flex-col gap-2">
                         {product.stockQuantity < 1500 && (
                           <span className="px-2 py-1 bg-red-500 border-2 border-red-700 text-white text-[8px] font-black uppercase tracking-widest">
                             LOW STOCK
                           </span>
                         )}
                         {isDiscounted && (
                           <span className="px-2 py-1 bg-gray-900 text-white text-[8px] font-black uppercase tracking-widest">
                             TIER SAVING
                           </span>
                         )}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight leading-tight mb-1">{product.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">{product.gradeSize} • {product.weightRange}</p>
                      
                      <div className="mt-auto flex items-end justify-between border-t-2 border-gray-100 pt-4">
                        <div className="flex flex-col">
                           {isDiscounted && (
                              <p className="text-[10px] text-gray-400 line-through font-black">฿{product.basePrice.toFixed(0)}</p>
                           )}
                           <p className="text-xl font-black text-blue-600 leading-none">
                             ฿{price.toFixed(2)}
                           </p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-gray-900 text-xl font-black group-hover:bg-blue-500 group-hover:border-blue-700 group-hover:text-white transition-colors">
                          +
                        </div>
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
