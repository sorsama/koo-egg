"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const poultryType = formData.get("poultryType") as string;
  const gradeSize = formData.get("gradeSize") as string;
  const weightRange = formData.get("weightRange") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10);
  const unit = formData.get("unit") as string || "eggs";

  if (!name || !poultryType || !gradeSize || !weightRange || isNaN(basePrice) || isNaN(stockQuantity)) {
    throw new Error("Missing required fields or invalid numeric values");
  }

  await prisma.product.create({
    data: {
      name,
      poultryType,
      gradeSize,
      weightRange,
      basePrice,
      stockQuantity,
      unit,
    },
  });

  revalidatePath("/admin/products");
}
