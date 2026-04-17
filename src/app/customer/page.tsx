import { prisma } from "@/lib/prisma";
import Link from "next/link";
import EggIcon from "@mui/icons-material/Egg";
import PetsIcon from "@mui/icons-material/Pets";
import { requireCustomer } from "@/lib/auth";
import { addItem } from "./cart/actions";

export const dynamic = "force-dynamic";

const POULTRY_TYPES = ["CHICKEN", "DUCK", "GOOSE", "QUAIL"] as const;

export default async function CustomerShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const session = await requireCustomer();
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const typeFilter = (sp.type ?? "").trim().toUpperCase();

  const accountType = session.accountType || "CONSUMER";

  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      ...(typeFilter && POULTRY_TYPES.includes(typeFilter as (typeof POULTRY_TYPES)[number])
        ? { poultryType: typeFilter }
        : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { gradeSize: { contains: q, mode: "insensitive" as const } },
              { weightRange: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    include: { pricingTiers: true },
    orderBy: [{ poultryType: "asc" }, { basePrice: "desc" }],
  });

  const grouped = products.reduce((acc, p) => {
    (acc[p.poultryType] ??= []).push(p);
    return acc;
  }, {} as Record<string, typeof products>);

  const poultryColors: Record<string, string> = {
    CHICKEN: "bg-blue-500",
    DUCK: "bg-emerald-500",
    GOOSE: "bg-amber-500",
    QUAIL: "bg-purple-500",
  };

  async function addAction(formData: FormData) {
    "use server";
    const productId = String(formData.get("productId") ?? "");
    await addItem(productId, 1);
  }

  const buildHref = (params: Record<string, string | undefined>) => {
    const entries = Object.entries({ q, type: typeFilter, ...params }).filter(
      ([, v]) => v && v.length > 0
    );
    const qs = new URLSearchParams(entries as [string, string][]).toString();
    return qs ? `/customer?${qs}` : "/customer";
  };

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center justify-between bg-white border-4 border-gray-900 p-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Catalog</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Live Inventory</p>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${
              accountType === "FOOD_BUSINESS"
                ? "bg-blue-100 border-blue-500 text-blue-800"
                : accountType === "RETAILER"
                ? "bg-emerald-100 border-emerald-500 text-emerald-800"
                : "bg-amber-100 border-amber-500 text-amber-800"
            }`}
          >
            {accountType.replace("_", " ")}
          </span>
          <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest">Tier Pricing</p>
        </div>
      </div>

      {/* Search form (GET → URL param) */}
      <form action="/customer" method="get" className="relative">
        {typeFilter ? <input type="hidden" name="type" value={typeFilter} /> : null}
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="SEARCH EGGS..."
          className="w-full px-6 py-4 bg-white border-4 border-gray-900 text-gray-900 text-sm font-black uppercase tracking-widest placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button type="submit" aria-label="Search" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 hover:bg-gray-100">
          <svg className="text-gray-400 stroke-[3]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <Link
          href={buildHref({ type: undefined })}
          className={`px-6 py-3 border-2 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
            !typeFilter ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900"
          }`}
        >
          All
        </Link>
        {POULTRY_TYPES.map((type) => (
          <Link
            key={type}
            href={buildHref({ type })}
            className={`flex items-center gap-2 px-6 py-3 border-2 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              typeFilter === type
                ? "bg-gray-900 border-gray-900 text-white"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center opacity-80">
              {type === "CHICKEN" || type === "DUCK" ? <PetsIcon fontSize="small" /> : <EggIcon fontSize="small" />}
            </span>
            {type}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="bg-white border-4 border-gray-900 p-8 text-center text-sm font-black uppercase tracking-widest text-gray-500">
          No products match {q ? `"${q}"` : "this filter"}
        </div>
      ) : null}

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
                <div key={product.id} className="bg-white border-4 border-gray-900 overflow-hidden relative flex flex-col group">
                  <Link href={`/customer/product/${product.id}`} className="block">
                    <div
                      className={`h-32 ${poultryColors[product.poultryType]} flex items-center justify-center relative overflow-hidden border-b-4 border-gray-900`}
                    >
                      <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                      <span className="text-6xl text-white flex items-center transform group-hover:scale-110 transition-all duration-300">
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
                  </Link>

                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/customer/product/${product.id}`} className="block">
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight leading-tight mb-1">{product.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">{product.gradeSize} • {product.weightRange}</p>
                    </Link>

                    <div className="mt-auto flex items-end justify-between border-t-2 border-gray-100 pt-4">
                      <div className="flex flex-col">
                        {isDiscounted && (
                          <p className="text-[10px] text-gray-400 line-through font-black">฿{product.basePrice.toFixed(0)}</p>
                        )}
                        <p className="text-xl font-black text-blue-600 leading-none">฿{price.toFixed(2)}</p>
                      </div>
                      <form action={addAction}>
                        <input type="hidden" name="productId" value={product.id} />
                        <button
                          type="submit"
                          aria-label={`Add ${product.name} to cart`}
                          className="w-10 h-10 bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-gray-900 text-xl font-black hover:bg-blue-500 hover:border-blue-700 hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
