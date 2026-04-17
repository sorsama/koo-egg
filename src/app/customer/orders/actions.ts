"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth";

const RESTOCKABLE = new Set(["PENDING", "CONFIRMED"]);

export async function cancelOrder(orderId: string, reason: string) {
  const session = await requireCustomer();
  const trimmed = reason.trim();
  if (!trimmed) throw new Error("Please provide a reason");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error("Order not found");
  if (order.customerId !== session.userId) throw new Error("Not allowed");
  if (!RESTOCKABLE.has(order.status)) throw new Error("Order can no longer be cancelled");

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED", cancelReason: trimmed },
    });
    for (const it of order.items) {
      await tx.product.update({
        where: { id: it.productId },
        data: { stockQuantity: { increment: it.quantity } },
      });
    }
  });

  revalidatePath("/customer/orders");
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
