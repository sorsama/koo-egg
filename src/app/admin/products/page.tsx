import { prisma } from "@/lib/prisma";
import EggIcon from "@mui/icons-material/Egg";
import PetsIcon from "@mui/icons-material/Pets";
import AddProductClient from "./AddProductClient";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { pricingTiers: true },
    orderBy: [{ poultryType: "asc" }, { gradeSize: "asc" }],
  });

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Product Administration</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-2">Manage details, images, and pricing</p>
        </div>
        <AddProductClient />
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => {
          const consumerPrice = product.pricingTiers.find((t) => t.accountType === "CONSUMER");
          const businessPrice = product.pricingTiers.find((t) => t.accountType === "FOOD_BUSINESS");
          const retailPrice = product.pricingTiers.find((t) => t.accountType === "RETAILER");

          return (
            <div key={product.id} className="bg-gray-50 rounded-lg p-8 hover:scale-[1.02] transition-transform duration-200 group border-4 border-transparent hover:border-blue-500 cursor-pointer relative overflow-hidden">
              
              {/* Product header */}
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white flex items-center justify-center text-blue-500 rounded-none shadow-none group-hover:scale-110 transition-transform duration-200">
                    {product.poultryType === "CHICKEN" || product.poultryType === "DUCK" ? (
                      <PetsIcon fontSize="large" />
                    ) : (
                      <EggIcon fontSize="large" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{product.name}</h3>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{product.gradeSize} • {product.weightRange}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-colors duration-200 rounded-md">
                  Edit
                </button>
              </div>

              {/* Pricing Tiers */}
              <div className="space-y-4 mb-8 relative z-10">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pricing Tiers</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-50 p-4 text-center border-l-4 border-emerald-500">
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Consumer</p>
                    <p className="text-lg font-black text-emerald-600">฿{consumerPrice?.price.toFixed(2) ?? product.basePrice.toFixed(2)}</p>
                  </div>
                  <div className="bg-purple-50 p-4 text-center border-l-4 border-purple-500">
                    <p className="text-[10px] font-black text-purple-800 uppercase tracking-widest mb-1">Business</p>
                    <p className="text-lg font-black text-purple-600">฿{businessPrice?.price.toFixed(2) ?? "—"}</p>
                  </div>
                  <div className="bg-amber-50 p-4 text-center border-l-4 border-amber-500">
                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Retailer</p>
                    <p className="text-lg font-black text-amber-600">฿{retailPrice?.price.toFixed(2) ?? "—"}</p>
                  </div>
                </div>
              </div>

              {/* Stock info */}
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500 mt-auto pt-6 border-t-2 border-gray-200 relative z-10">
                <span>Stock: <span className="text-gray-900">{product.stockQuantity.toLocaleString()}</span></span>
                <span>ID: {product.id.slice(0, 8)}...</span>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
