import { prisma } from "@/lib/prisma";
import EggIcon from "@mui/icons-material/Egg";
import PetsIcon from "@mui/icons-material/Pets";
import AddProductClient from "./AddProductClient";
import EditProductClient from "./EditProductClient";
import PricingTierClient from "./PricingTierClient";

export const dynamic = "force-dynamic";

type ProductWithTiers = Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
  pricingTiers: { id: string; accountType: string; price: number }[];
};

function ProductCard({ product, archived = false }: { product: ProductWithTiers; archived?: boolean }) {
  const consumerPrice = product.pricingTiers.find((t) => t.accountType === "CONSUMER");
  const businessPrice = product.pricingTiers.find((t) => t.accountType === "FOOD_BUSINESS");
  const retailPrice = product.pricingTiers.find((t) => t.accountType === "RETAILER");

  return (
    <div
      className={`bg-gray-50 rounded-lg p-8 group border-4 border-transparent hover:border-blue-500 relative overflow-hidden transition-transform duration-200 ${
        archived ? "opacity-60" : "hover:scale-[1.01]"
      }`}
    >
      <div className="flex items-start justify-between mb-8 relative z-10 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 bg-white flex items-center justify-center text-blue-500 rounded-none shadow-none overflow-hidden">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : product.poultryType === "CHICKEN" || product.poultryType === "DUCK" ? (
              <PetsIcon className="w-8 h-8" />
            ) : (
              <EggIcon className="w-8 h-8" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight truncate">{product.name}</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              {product.gradeSize} • {product.weightRange}
            </p>
            {archived ? (
              <span className="inline-block mt-1 px-2 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest">
                Archived
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <EditProductClient
            product={{
              id: product.id,
              name: product.name,
              poultryType: product.poultryType,
              gradeSize: product.gradeSize,
              weightRange: product.weightRange,
              basePrice: product.basePrice,
              stockQuantity: product.stockQuantity,
              unit: product.unit,
              description: product.description,
              image: product.image,
              isArchived: product.isArchived,
            }}
          />
          <PricingTierClient
            productId={product.id}
            productName={product.name}
            basePrice={product.basePrice}
            tiers={product.pricingTiers}
          />
        </div>
      </div>

      <div className="space-y-4 mb-8 relative z-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pricing Tiers</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 p-4 text-center border-l-4 border-emerald-500">
            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Consumer</p>
            <p className="text-lg font-black text-emerald-600">
              ฿{consumerPrice?.price.toFixed(2) ?? product.basePrice.toFixed(2)}
            </p>
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

      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500 mt-auto pt-6 border-t-2 border-gray-200 relative z-10">
        <span>
          Stock: <span className="text-gray-900">{product.stockQuantity.toLocaleString()}</span>
        </span>
        <span>ID: {product.id.slice(0, 8)}...</span>
      </div>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />
    </div>
  );
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { pricingTiers: true },
    orderBy: [{ poultryType: "asc" }, { gradeSize: "asc" }],
  });

  const active = products.filter((p) => !p.isArchived);
  const archived = products.filter((p) => p.isArchived);

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Product Administration</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-2">
            Manage details, stock, and pricing tiers
          </p>
        </div>
        <AddProductClient />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {active.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {archived.length > 0 && (
        <details className="mt-12 border-4 border-amber-500">
          <summary className="cursor-pointer px-6 py-4 bg-amber-100 font-black uppercase tracking-widest text-amber-900 text-sm">
            Archived Products ({archived.length})
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {archived.map((product) => (
              <ProductCard key={product.id} product={product} archived />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
