import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count();
  const totalStock = await prisma.product.aggregate({ _sum: { stockQuantity: true } });
  const totalOrders = await prisma.order.count();
  const totalUsers = await prisma.user.count({ where: { role: "CUSTOMER" } });
  const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
  const processingOrders = await prisma.order.count({ where: { status: "PROCESSING" } });
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

  const stats = [
    { label: "Total Products", value: totalProducts, color: "from-[#3498DB] to-[#2C3E50]", icon: "📦" },
    { label: "Total Stock", value: (totalStock._sum.stockQuantity ?? 0).toLocaleString(), color: "from-[#2D7A4F] to-[#3DA065]", icon: "🥚" },
    { label: "Total Orders", value: totalOrders, color: "from-[#D4A24E] to-[#F2D98D]", icon: "📋" },
    { label: "Customers", value: totalUsers, color: "from-[#E74C3C] to-[#C0392B]", icon: "👥" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/50 mt-1">Overview of KOO Integrated Egg operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all-smooth">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} opacity-20`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-medium">
                {pendingOrders} Pending
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium">
                {processingOrders} Processing
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                    order.customer.accountType === "FOOD_BUSINESS"
                      ? "bg-purple-500/20 text-purple-400"
                      : order.customer.accountType === "RETAILER"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-green-500/20 text-green-400"
                  }`}>
                    {order.customer.accountType === "FOOD_BUSINESS" ? "B2B" : order.customer.accountType === "RETAILER" ? "RTL" : "B2C"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{order.customer.fullname}</p>
                    <p className="text-xs text-white/40">
                      {order.items.length} item(s) • ฿{order.subtotal.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  order.status === "DELIVERED"
                    ? "bg-green-500/10 text-green-400"
                    : order.status === "PROCESSING"
                    ? "bg-blue-500/10 text-blue-400"
                    : order.status === "CANCELLED"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-yellow-500/10 text-yellow-400"
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Low Stock Alerts</h2>
            <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium">
              ⚠️ {lowStockProducts.length} Items
            </span>
          </div>
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#D4A24E]/10 flex items-center justify-center text-lg">
                    {product.poultryType === "CHICKEN" ? "🐔" : product.poultryType === "DUCK" ? "🦆" : product.poultryType === "GOOSE" ? "🪿" : "🐦"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{product.name}</p>
                    <p className="text-xs text-white/40">{product.gradeSize} • {product.weightRange}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${product.stockQuantity < 1000 ? "text-red-400" : "text-yellow-400"}`}>
                    {product.stockQuantity.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-white/30">units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
