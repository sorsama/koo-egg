import { prisma } from "@/lib/prisma";
import OrderList from "./OrderList";

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
    <div className="py-8 space-y-8">
      <div className="flex items-center justify-between border-b-4 border-gray-900 pb-6">
         <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">My Orders</h1>
         <div className="px-4 py-2 bg-blue-100 border-2 border-blue-500 text-[10px] text-blue-800 font-black uppercase tracking-widest">
            {orders.length} ACTIVE
         </div>
      </div>
      
      <OrderList orders={orders} />
    </div>
  );
}
