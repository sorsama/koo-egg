import { prisma } from "@/lib/prisma";
import Link from "next/link";
import EggIcon from "@mui/icons-material/Egg";
import PetsIcon from "@mui/icons-material/Pets";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ poultryType: "asc" }, { stockQuantity: "asc" }],
  });

  const grouped = products.reduce((acc, p) => {
    if (!acc[p.poultryType]) acc[p.poultryType] = [];
    acc[p.poultryType].push(p);
    return acc;
  }, {} as Record<string, typeof products>);

  const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);

  return (
    <div className="p-10 space-y-12 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-gray-900 pb-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase">Inventory Management</h1>
          <p className="text-gray-500 mt-2 uppercase text-sm font-bold tracking-widest">L1:5 Stock Management — FIFO tracking</p>
        </div>
        <div className="bg-amber-50 px-8 py-6 border-l-8 border-amber-500">
          <p className="text-[10px] text-amber-800 font-black uppercase tracking-widest mb-2">Total Stock</p>
          <p className="text-4xl font-black text-amber-600 tracking-tighter">{totalStock.toLocaleString()} <span className="text-sm font-bold text-amber-800 uppercase tracking-widest ml-1">units</span></p>
        </div>
      </div>

      {/* FIFO indicator */}
      <div className="bg-emerald-50 border-4 border-emerald-500 p-6 flex items-center gap-6">
        <div className="w-14 h-14 bg-emerald-500 text-white flex items-center justify-center font-black text-lg uppercase tracking-widest">
          FIFO
        </div>
        <div>
          <p className="text-lg font-black text-emerald-900 uppercase tracking-tight">First-In, First-Out Enabled</p>
          <p className="text-sm font-bold text-emerald-700 mt-1">Earliest expiry stock is prioritized for all dispatch and POS orders.</p>
        </div>
      </div>

      {/* Inventory by type */}
      <div className="space-y-12">
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="bg-white border-4 border-gray-100 overflow-hidden">
            <div className="px-8 py-6 bg-gray-50 border-b-4 border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center">
                  {type === "CHICKEN" || type === "DUCK" ? (
                    <PetsIcon fontSize="medium" />
                  ) : (
                    <EggIcon fontSize="medium" />
                  )}
                </span>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{type} Eggs</h2>
              </div>
              <span className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-900 font-black text-xs uppercase tracking-widest">
                {items.length} Variants
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] text-gray-500 uppercase tracking-widest font-black border-b-2 border-gray-100 bg-white">
                    <th className="px-8 py-4">Product</th>
                    <th className="px-8 py-4">Grade</th>
                    <th className="px-8 py-4">Weight</th>
                    <th className="px-8 py-4">Base Price</th>
                    <th className="px-8 py-4">Stock Level</th>
                    <th className="px-8 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-50">
                  {items.map((product) => {
                    const stockLevel =
                      product.stockQuantity < 1000
                        ? "critical"
                        : product.stockQuantity < 3000
                        ? "low"
                        : "normal";
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="text-base font-black text-gray-900 uppercase tracking-tight">{product.name}</p>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-gray-600 uppercase">{product.gradeSize}</td>
                        <td className="px-8 py-6 text-sm font-bold text-gray-600 uppercase tracking-widest">{product.weightRange}</td>
                        <td className="px-8 py-6 text-lg font-black text-blue-600">฿{product.basePrice.toFixed(2)}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4 w-48">
                            <span className="text-lg font-black text-gray-900 w-16">{product.stockQuantity.toLocaleString()}</span>
                            <div className="flex-1 h-3 bg-gray-200 rounded-none overflow-hidden">
                              <div
                                className={`h-full ${
                                  stockLevel === "critical"
                                    ? "bg-red-500"
                                    : stockLevel === "low"
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(100, (product.stockQuantity / 30000) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest inline-block ${
                            stockLevel === "critical"
                              ? "bg-red-100 text-red-800 border-2 border-red-200"
                              : stockLevel === "low"
                              ? "bg-amber-100 text-amber-800 border-2 border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border-2 border-emerald-200"
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
    </div>
  );
}
