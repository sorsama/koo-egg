import { prisma } from "@/lib/prisma";
import OrderClient from "./OrderClient";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      items: { include: { product: true } },
      invoice: true,
    },
  });

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" }
  });

  const aggregation = await prisma.product.aggregate({
    _sum: {
      stockQuantity: true
    }
  });

  return (
    <OrderClient 
      orders={orders as any} 
      products={products} 
      totalStock={aggregation._sum.stockQuantity || 0} 
    />
  );
}