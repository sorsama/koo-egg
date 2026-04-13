"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createManualOrder(formData: FormData) {
  const customerName = formData.get("customerName") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const unitPrice = parseFloat(formData.get("unitPrice") as string);
  const productId = formData.get("productId") as string;

  if (!customerName || !quantity || !unitPrice || !productId) {
    throw new Error("Missing required fields");
  }

  // Check stock
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error("Product not found");
  }
  if (product.stockQuantity < quantity) {
    throw new Error("Insufficient stock");
  }

  // Use a default customer for walk-ins if we don't want to create one,
  // or create a temporary "walk-in" customer
  let customer = await prisma.user.findFirst({
    where: { email: "walkin@example.com" },
  });

  if (!customer) {
    customer = await prisma.user.create({
      data: {
        fullname: "Walk-in Customer",
        email: "walkin@example.com",
        role: "CUSTOMER",
        accountType: "CONSUMER",
      },
    });
  }

  // Create the order
  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: "CONFIRMED", // or PROCESSING/DELIVERED
      subtotal: quantity * unitPrice,
      paymentMethod: "CASH",
      items: {
        create: {
          productId: productId,
          quantity: quantity,
          priceAtTime: unitPrice,
        },
      },
    },
  });

  // Decrement stock
  await prisma.product.update({
    where: { id: productId },
    data: {
      stockQuantity: {
        decrement: quantity,
      },
    },
  });

  revalidatePath("/admin/orders");
  return order.id;
}
