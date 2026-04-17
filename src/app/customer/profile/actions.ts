"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth";

export async function cancelSubscription(
  subscriptionId: string,
  reason: string,
  customReason: string
) {
  const session = await requireCustomer();
  const r = reason.trim();
  const cr = customReason.trim();
  if (!r) throw new Error("Please choose a reason");

  const combined = r === "Other" && cr ? `Other — ${cr}` : cr ? `${r} — ${cr}` : r;

  const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
  if (!sub) throw new Error("Subscription not found");
  if (sub.customerId !== session.userId) throw new Error("Not allowed");

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: "CANCELLED", inactiveReason: combined },
  });

  revalidatePath("/customer/profile");
}
