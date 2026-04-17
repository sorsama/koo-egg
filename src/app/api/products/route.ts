import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    orderBy: [{ poultryType: "asc" }, { gradeSize: "asc" }],
  });
  return NextResponse.json(products);
}
