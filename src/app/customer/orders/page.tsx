import { prisma } from "@/lib/prisma";

export default async function CustomerOrdersPage() {
  // For prototype, show the consumer's orders
  const consumer = await prisma.user.findFirst({
    where: { accountType: "CONSUMER" },
  });

  const orders = consumer
    ? await prisma.order.findMany({
        where: { customerId: consumer.id },
        include: {
          items: { include: { product: true } },
          invoice: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="py-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">My Orders</h1>

      {orders.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-white/50">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass rounded-2xl p-5 space-y-4">
              {/* Order header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 font-mono">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  order.status === "DELIVERED"
                    ? "bg-green-500/10 text-green-400"
                    : order.status === "PROCESSING"
                    ? "bg-blue-500/10 text-blue-400"
                    : order.status === "CANCELLED"
                    ? "bg-red-500/10 text-red-400"
                    : order.status === "DELIVERING"
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-yellow-500/10 text-yellow-400"
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Items */}
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                  <div className="w-10 h-10 rounded-lg bg-[#D4A24E]/10 flex items-center justify-center text-lg">
                    {item.product.poultryType === "CHICKEN" ? "🐔" : item.product.poultryType === "DUCK" ? "🦆" : "🥚"}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white">{item.product.name}</p>
                    <p className="text-[10px] text-white/40">Qty: {item.quantity} × ฿{item.priceAtTime.toFixed(2)}</p>
                  </div>
                  <p className="text-sm font-bold text-[#D4A24E]">
                    ฿{(item.quantity * item.priceAtTime).toFixed(2)}
                  </p>
                </div>
              ))}

              {/* Total & GPS */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-sm text-white/50">Total: <span className="font-bold text-white">฿{order.subtotal.toFixed(2)}</span></span>
                {order.status === "DELIVERING" && order.trackingLat && (
                  <button className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-medium">
                    📍 Track GPS
                  </button>
                )}
              </div>

              {/* Invoice */}
              {order.invoice && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#D4A24E]/5">
                  <span className="text-xs">📄</span>
                  <span className="text-xs text-[#D4A24E] font-mono">{order.invoice.invoiceNumber}</span>
                  <span className="text-[10px] text-white/30 ml-auto">Total: ฿{order.invoice.total.toFixed(2)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
