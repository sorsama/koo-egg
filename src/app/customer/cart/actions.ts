"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart";

const VAT_RATE = 0.07;
const VALID_METHODS = ["CASH", "CREDIT_CARD", "BANK_TRANSFER", "QR_PROMPTPAY"] as const;
type PaymentMethod = (typeof VALID_METHODS)[number];

export async function addItem(productId: string, quantity = 1) {
  if (!productId) return;
  await addToCart(productId, Math.max(1, Math.floor(quantity)));
  revalidatePath("/customer");
  revalidatePath("/customer/cart");
  revalidatePath(`/customer/product/${productId}`);
}

export async function updateQuantity(productId: string, quantity: number) {
  await updateCartQuantity(productId, Math.floor(quantity));
  revalidatePath("/customer/cart");
}

export async function removeItem(productId: string) {
  await removeFromCart(productId);
  revalidatePath("/customer/cart");
}

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

export async function checkout(formData: FormData) {
  const session = await requireCustomer();
  const paymentMethod = String(formData.get("paymentMethod") ?? "") as PaymentMethod;
  if (!VALID_METHODS.includes(paymentMethod)) throw new Error("Select a payment method");

  const cart = await getCart();
  if (cart.length === 0) throw new Error("Cart is empty");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) throw new Error("Customer not found");

  const products = await prisma.product.findMany({
    where: { id: { in: cart.map((c) => c.productId) }, isArchived: false },
    include: { pricingTiers: true },
  });

  const accountType = user.accountType ?? "CONSUMER";

  const orderItems = cart.map((ci) => {
    const prod = products.find((p) => p.id === ci.productId);
    if (!prod) throw new Error("Product unavailable");
    if (prod.stockQuantity < ci.quantity) {
      throw new Error(`Not enough stock for ${prod.name}`);
    }
    const tier = prod.pricingTiers.find((t) => t.accountType === accountType);
    const unitPrice = tier?.price ?? prod.basePrice;
    return {
      productId: prod.id,
      quantity: ci.quantity,
      priceAtTime: unitPrice,
      lineTotal: unitPrice * ci.quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, it) => sum + it.lineTotal, 0);
  const tax = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const invoiceNumber = await nextInvoiceNumber();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        customerId: user.id,
        status: "CONFIRMED",
        address: user.address,
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

  await clearCart();
  revalidatePath("/customer");
  revalidatePath("/customer/cart");
  revalidatePath("/customer/orders");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  for (const it of orderItems) {
    revalidatePath(`/customer/product/${it.productId}`);
  }
  redirect(`/customer/orders?placed=${order.id}`);
}
