"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSubscription(formData: FormData) {
  const customerId = formData.get("customerId") as string;
  const productId = formData.get("productId") as string;
  const frequency = formData.get("frequency") as string;
  const quantity = parseInt(formData.get("quantity") as string);

  if (!customerId || !productId || !frequency || !quantity) {
    throw new Error("Missing required fields");
  }

  await prisma.subscription.create({
    data: {
      customerId,
      productId,
      frequency,
      quantity,
      status: "ACTIVE",
    },
  });

  revalidatePath("/customer/profile");
  return { success: true };
}
