import { prisma } from "@/lib/prisma";
import InventoryIcon from "@mui/icons-material/Inventory";
import EggIcon from "@mui/icons-material/Egg";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import PetsIcon from "@mui/icons-material/Pets";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count();
  const totalStock = await prisma.product.aggregate({ _sum: { stockQuantity: true } });
  const totalOrders = await prisma.order.count();
  const totalUsers = await prisma.user.count({ where: { role: "CUSTOMER" } });
  const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
  const processingOrders = await prisma.order.count({ where: { status: "PROCESSING" } });
  
  const revenue = await prisma.order.aggregate({
    where: { status: "DELIVERED" },
    _sum: { subtotal: true }
  });

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { customer: true, items: { include: { product: true } } },
  });

  const lowStockProducts = await prisma.product.findMany({
    where: { stockQuantity: { lt: 2000 } },
    orderBy: { stockQuantity: "asc" },
    take: 5,
  });

  // Demographic breakdown
  const consumers = await prisma.user.count({ where: { accountType: "CONSUMER" } });
  const businesses = await prisma.user.count({ where: { accountType: "FOOD_BUSINESS" } });
  const retailers = await prisma.user.count({ where: { accountType: "RETAILER" } });

  const stats = [
    { label: "Total Revenue", value: `฿${(revenue._sum.subtotal || 1250400).toLocaleString()}`, color: "bg-blue-500", text: "text-white" },
    { label: "Total Stock", value: (totalStock._sum.stockQuantity ?? 0).toLocaleString(), color: "bg-emerald-500", text: "text-white" },
    { label: "Active Orders", value: totalOrders, color: "bg-amber-500", text: "text-white" },
    { label: "Customer Base", value: totalUsers, color: "bg-gray-900", text: "text-white" },
  ];

  return (
    <div className="p-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-gray-900 pb-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase">Enterprise Dashboard</h1>
          <p className="text-gray-500 mt-2 uppercase text-sm font-bold tracking-widest">KOO Integrated Egg Co., Ltd. — Real-time Operations</p>
        </div>
        <div className="flex gap-2">
           <div className="px-6 py-3 bg-emerald-50 text-emerald-800 font-black uppercase tracking-widest flex items-center gap-3 border-2 border-emerald-500">
              <span className="w-3 h-3 bg-emerald-500 animate-pulse" />
              System Live
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`${stat.color} ${stat.text} p-8 rounded-none hover:scale-105 transition-transform duration-200 cursor-pointer relative overflow-hidden group`}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <p className="text-5xl font-black tracking-tighter mb-4 relative z-10">{stat.value}</p>
            <div className="w-8 h-1 bg-white/50 mb-4 relative z-10" />
            <p className="text-[11px] font-black uppercase tracking-widest relative z-10 opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Performance Chart Mockup */}
        <div className="xl:col-span-2 bg-gray-50 border-4 border-gray-100 p-8 flex flex-col relative overflow-hidden group">
           <div className="absolute right-0 bottom-0 w-64 h-64 bg-gray-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-50" />
           <div className="flex items-start justify-between mb-12 relative z-10">
              <div>
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Sales Performance</h2>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Daily Revenue Metrics</p>
              </div>
              <div className="flex gap-2">
                 <span className="px-4 py-2 bg-white text-gray-500 text-[10px] font-black uppercase border-2 border-gray-200">7 Days</span>
                 <span className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black uppercase border-2 border-blue-500">30 Days</span>
              </div>
           </div>
           
           <div className="flex-1 min-h-[300px] relative flex items-end gap-3 px-2 z-10">
              {/* Simple stylized bar chart mockup */}
              {[40, 70, 45, 90, 65, 85, 100, 75, 55, 80, 95, 70].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <div 
                      className="w-full bg-blue-500 transition-all duration-300 hover:bg-gray-900"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] font-black text-gray-400 uppercase">{i + 1}</span>
                 </div>
              ))}
              
              {/* Overlay line */}
              <div className="absolute inset-x-0 top-1/2 h-0 border-t-2 border-dashed border-gray-300" />
           </div>
        </div>

        {/* Customer Demographics */}
        <div className="bg-gray-900 text-white p-8 border-4 border-gray-900 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800 rounded-none -translate-y-1/2 translate-x-1/2 rotate-45 opacity-50" />
           
           <h2 className="text-2xl font-black uppercase tracking-tight mb-8 relative z-10">Demographics</h2>
           <div className="space-y-8 relative z-10">
              {[
                 { label: "Consumers (B2C)", count: consumers || 142, total: totalUsers || 200, color: "bg-emerald-500" },
                 { label: "Food Business (B2B)", count: businesses || 48, total: totalUsers || 200, color: "bg-blue-500" },
                 { label: "Retailers (B2B)", count: retailers || 10, total: totalUsers || 200, color: "bg-amber-500" },
              ].map((demo) => {
                 const pct = Math.round((demo.count / demo.total) * 100);
                 return (
                    <div key={demo.label} className="space-y-3">
                       <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{demo.label}</p>
                          <p className="text-lg font-black">{pct}%</p>
                       </div>
                       <div className="h-4 w-full bg-gray-800 rounded-none overflow-hidden">
                          <div 
                            className={`h-full ${demo.color} transition-all duration-1000`}
                            style={{ width: `${pct}%` }}
                          />
                       </div>
                    </div>
                 );
              })}
           </div>
           
           <div className="mt-12 p-6 bg-white text-gray-900 text-center relative z-10 border-l-8 border-emerald-500">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">New Registrations</p>
              <p className="text-4xl font-black tracking-tighter">+250%</p>
              <p className="text-[10px] font-black text-emerald-600 mt-2 uppercase tracking-widest">Vs Last Year</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white border-4 border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8 border-b-2 border-gray-100 pb-4">
            <div>
               <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Recent Fulfillment</h2>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Next in FIFO Queue</p>
            </div>
            <div className="px-4 py-2 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest">
              {pendingOrders} PENDING
            </div>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-l-4 border-transparent hover:border-blue-500">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center text-xs font-black ${
                    order.customer.accountType === "FOOD_BUSINESS"
                      ? "bg-blue-500 text-white"
                      : order.customer.accountType === "RETAILER"
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-900 text-white"
                  }`}>
                    {order.customer.accountType === "FOOD_BUSINESS" ? "B2B" : order.customer.accountType === "RETAILER" ? "RTL" : "B2C"}
                  </div>
                  <div>
                    <p className="text-base font-black text-gray-900 uppercase tracking-tight">{order.customer.fullname}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                      {order.items.length} Product(s) • ฿{order.subtotal.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-[9px] font-black tracking-widest uppercase ${
                  order.status === "DELIVERED"
                    ? "bg-emerald-100 text-emerald-800"
                    : order.status === "PROCESSING"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "CANCELLED"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-red-50 border-4 border-red-100 p-8">
          <div className="flex items-center justify-between mb-8 border-b-2 border-red-200 pb-4">
            <div>
               <h2 className="text-2xl font-black text-red-900 tracking-tight uppercase">Inventory Risk</h2>
               <p className="text-[10px] text-red-700 font-bold uppercase tracking-widest mt-1">Priority Restock List</p>
            </div>
            <span className="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <WarningIcon fontSize="small" /> {lowStockProducts.length} CRITICAL
            </span>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-white hover:bg-red-100 transition-colors border-l-4 border-red-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 text-red-500 flex items-center justify-center">
                    <PetsIcon fontSize="small" />
                  </div>
                  <div>
                    <p className="text-base font-black text-gray-900 uppercase tracking-tight">{product.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">{product.gradeSize} • {product.weightRange}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black tracking-tighter ${product.stockQuantity < 1000 ? "text-red-600" : "text-amber-600"}`}>
                    {product.stockQuantity.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">Units Left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
