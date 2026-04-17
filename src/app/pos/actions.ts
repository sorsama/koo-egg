"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const VAT_RATE = 0.07;
const VALID_METHODS = ["CASH", "CREDIT_CARD", "BANK_TRANSFER", "QR_PROMPTPAY"] as const;
type PaymentMethod = (typeof VALID_METHODS)[number];

export type PosLine = { productId: string; quantity: number };

async function nextInvoiceNumber() {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const last = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: "desc" },
  });
  const nextSeq = last ? parseInt(last.invoiceNumber.slice(prefix.length), 10) + 1 : 1;
  return `${prefix}${String(nextSeq).padStart(3, "0")}`;
}

export async function completeSale(lines: PosLine[], paymentMethod: PaymentMethod) {
  const session = await requireAdmin();
  if (!VALID_METHODS.includes(paymentMethod)) throw new Error("Invalid payment method");
  if (!Array.isArray(lines) || lines.length === 0) throw new Error("Cart is empty");

  const productIds = lines.map((l) => l.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isArchived: false },
  });

  const orderItems = lines.map((l) => {
    const prod = products.find((p) => p.id === l.productId);
    if (!prod) throw new Error("Product unavailable");
    if (prod.stockQuantity < l.quantity) throw new Error(`Not enough stock for ${prod.name}`);
    const lineTotal = prod.basePrice * l.quantity;
    return { productId: prod.id, quantity: l.quantity, priceAtTime: prod.basePrice, lineTotal };
  });

  const subtotal = orderItems.reduce((sum, it) => sum + it.lineTotal, 0);
  const tax = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const invoiceNumber = await nextInvoiceNumber();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerId: session.userId,
        status: "DELIVERED",
        address: "POS Walk-in",
        subtotal,
        paymentMethod,
        items: {
          create: orderItems.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            priceAtTime: it.priceAtTime,
          })),
        },
      },
    });

    for (const it of orderItems) {
      await tx.product.update({
        where: { id: it.productId },
        data: { stockQuantity: { decrement: it.quantity } },
      });
    }

    await tx.invoice.create({
      data: {
        orderId: created.id,
        invoiceNumber,
        subtotal,
        tax,
        total,
      },
    });

    return created;
  });

  revalidatePath("/pos");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/inventory");

  return { orderId: order.id, invoiceNumber, subtotal, tax, total };
}
