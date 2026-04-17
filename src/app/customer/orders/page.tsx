import { prisma } from "@/lib/prisma";
import OrderList from "./OrderList";
import { requireCustomer } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ placed?: string }>;
}) {
  const session = await requireCustomer();
  const sp = await searchParams;

  const orders = await prisma.order.findMany({
    where: { customerId: session.userId },
    include: {
      items: { include: { product: true } },
      invoice: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 space-y-8">
      {sp.placed ? (
        <div className="bg-emerald-100 border-4 border-emerald-500 text-emerald-900 p-4 font-black uppercase tracking-widest text-xs">
          Order placed · #{sp.placed.slice(0, 8)} — invoice generated
        </div>
      ) : null}

      <div className="flex items-center justify-between border-b-4 border-gray-900 pb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">My Orders</h1>
        <div className="px-4 py-2 bg-blue-100 border-2 border-blue-500 text-[10px] text-blue-800 font-black uppercase tracking-widest">
          {orders.length} Total
        </div>
      </div>

      <OrderList orders={orders} />
    </div>
  );
}
