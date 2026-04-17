import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import POSClient from "./POSClient";

export const dynamic = "force-dynamic";

export default async function POSPage() {
  const session = await requireAdmin();
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    orderBy: [{ poultryType: "asc" }, { gradeSize: "asc" }],
  });

  return (
    <POSClient
      operatorName={session.name ?? session.role}
      products={products.map((p) => ({
        id: p.id,
        name: p.name,
        poultryType: p.poultryType,
        gradeSize: p.gradeSize,
        weightRange: p.weightRange,
        basePrice: p.basePrice,
        stockQuantity: p.stockQuantity,
      }))}
    />
  );
}
