"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function parseNumber(raw: FormDataEntryValue | null, field: string) {
  const num = parseFloat(String(raw ?? ""));
  if (!Number.isFinite(num)) throw new Error(`Invalid value for ${field}`);
  return num;
}

function parseInteger(raw: FormDataEntryValue | null, field: string) {
  const num = parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(num)) throw new Error(`Invalid value for ${field}`);
  return num;
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const poultryType = String(formData.get("poultryType") ?? "").trim();
  const gradeSize = String(formData.get("gradeSize") ?? "").trim();
  const weightRange = String(formData.get("weightRange") ?? "").trim();
  const unit = String(formData.get("unit") ?? "eggs").trim() || "eggs";
  const basePrice = parseNumber(formData.get("basePrice"), "base price");
  const stockQuantity = parseInteger(formData.get("stockQuantity"), "stock quantity");
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!name || !poultryType || !gradeSize || !weightRange) {
    throw new Error("Missing required fields");
  }

  const product = await prisma.product.create({
    data: {
      name,
      poultryType,
      gradeSize,
      weightRange,
      basePrice,
      stockQuantity,
      unit,
      description,
    },
  });

  await prisma.pricingTier.create({
    data: { productId: product.id, accountType: "CONSUMER", price: basePrice },
  });

  revalidatePath("/admin/products");
  revalidatePath("/customer");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const poultryType = String(formData.get("poultryType") ?? "").trim();
  const gradeSize = String(formData.get("gradeSize") ?? "").trim();
  const weightRange = String(formData.get("weightRange") ?? "").trim();
  const unit = String(formData.get("unit") ?? "eggs").trim() || "eggs";
  const basePrice = parseNumber(formData.get("basePrice"), "base price");
  const stockQuantity = parseInteger(formData.get("stockQuantity"), "stock quantity");
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!name || !poultryType || !gradeSize || !weightRange) {
    throw new Error("Missing required fields");
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      poultryType,
      gradeSize,
      weightRange,
      basePrice,
      stockQuantity,
      unit,
      description,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/customer");
  revalidatePath(`/customer/product/${id}`);
}

export async function archiveProduct(id: string) {
  await prisma.product.update({ where: { id }, data: { isArchived: true } });
  revalidatePath("/admin/products");
  revalidatePath("/customer");
}

export async function unarchiveProduct(id: string) {
  await prisma.product.update({ where: { id }, data: { isArchived: false } });
  revalidatePath("/admin/products");
  revalidatePath("/customer");
}

export async function upsertPricingTier(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const accountType = String(formData.get("accountType") ?? "");
  const price = parseNumber(formData.get("price"), "price");

  if (!productId || !accountType) throw new Error("Missing productId or accountType");
  const valid = ["CONSUMER", "FOOD_BUSINESS", "RETAILER"];
  if (!valid.includes(accountType)) throw new Error("Invalid account type");

  const existing = await prisma.pricingTier.findFirst({ where: { productId, accountType } });
  if (existing) {
    await prisma.pricingTier.update({ where: { id: existing.id }, data: { price } });
  } else {
    await prisma.pricingTier.create({ data: { productId, accountType, price } });
  }

  revalidatePath("/admin/products");
  revalidatePath("/customer");
  revalidatePath(`/customer/product/${productId}`);
}

export async function deletePricingTier(tierId: string) {
  const tier = await prisma.pricingTier.findUnique({ where: { id: tierId } });
  await prisma.pricingTier.delete({ where: { id: tierId } });
  revalidatePath("/admin/products");
  revalidatePath("/customer");
  if (tier) revalidatePath(`/customer/product/${tier.productId}`);
}
