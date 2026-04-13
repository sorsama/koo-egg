import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.invoice.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.pricingTier.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // ============================================================
  // D1: Seed Users
  // ============================================================
  const customerConsumer = await prisma.user.create({
    data: {
      fullname: "Somchai Jaidee",
      email: "somchai@email.com",
      phoneNumber: "081-234-5678",
      address: "123 Sukhumvit Rd, Bangkok 10110",
      role: "CUSTOMER",
      accountType: "CONSUMER",
      paymentInfo: "Visa **** 4242",
    },
  });

  const customerBusiness = await prisma.user.create({
    data: {
      fullname: "Grand Hotel Group Co.,Ltd.",
      email: "procurement@grandhotel.co.th",
      phoneNumber: "02-987-6543",
      address: "456 Silom Rd, Bangkok 10500",
      role: "CUSTOMER",
      accountType: "FOOD_BUSINESS",
      paymentInfo: "Bank Transfer - SCB",
    },
  });

  const customerRetailer = await prisma.user.create({
    data: {
      fullname: "WholeFoods Metro Ltd.",
      email: "orders@wholefoods.co.th",
      phoneNumber: "02-111-2222",
      address: "789 Ratchada Rd, Bangkok 10310",
      role: "CUSTOMER",
      accountType: "RETAILER",
      paymentInfo: "Bank Transfer - KBank",
    },
  });

  const employee = await prisma.user.create({
    data: {
      fullname: "Alex Agron",
      email: "alex@kooegg.co.th",
      phoneNumber: "089-999-0000",
      role: "EMPLOYEE",
    },
  });

  const admin = await prisma.user.create({
    data: {
      fullname: "KOO Admin",
      email: "admin@kooegg.co.th",
      phoneNumber: "02-000-0000",
      role: "ADMIN",
    },
  });

  // ============================================================
  // D2: Seed Products - Thai Standard Egg Grading
  // ============================================================

  // Chicken Eggs
  const chickenProducts = [
    { name: "Chicken Egg - Jumbo (Size 0)", gradeSize: "Size 0", weightRange: ">70g", basePrice: 7.0, stock: 12000 },
    { name: "Chicken Egg - Extra Large (Size 1)", gradeSize: "Size 1", weightRange: "65-70g", basePrice: 6.0, stock: 18000 },
    { name: "Chicken Egg - Large (Size 2)", gradeSize: "Size 2", weightRange: "60-65g", basePrice: 5.5, stock: 25000 },
    { name: "Chicken Egg - Medium (Size 3)", gradeSize: "Size 3", weightRange: "55-60g", basePrice: 5.0, stock: 20000 },
    { name: "Chicken Egg - Small (Size 4)", gradeSize: "Size 4", weightRange: "50-55g", basePrice: 4.5, stock: 15000 },
    { name: "Chicken Egg - Mini (Size 5)", gradeSize: "Size 5", weightRange: "<50g", basePrice: 4.0, stock: 8000 },
  ];

  // Duck Eggs
  const duckProducts = [
    { name: "Duck Egg - Large", gradeSize: "Large", weightRange: ">80g", basePrice: 8.0, stock: 5000 },
    { name: "Duck Egg - Medium", gradeSize: "Medium", weightRange: "70-80g", basePrice: 7.0, stock: 8000 },
    { name: "Duck Egg - Salted (Premium)", gradeSize: "Premium", weightRange: ">75g", basePrice: 12.0, stock: 3000 },
  ];

  // Goose Eggs
  const gooseProducts = [
    { name: "Goose Egg - Large", gradeSize: "Large", weightRange: ">140g", basePrice: 25.0, stock: 1000 },
    { name: "Goose Egg - Medium", gradeSize: "Medium", weightRange: "120-140g", basePrice: 22.0, stock: 800 },
  ];

  // Quail Eggs
  const quailProducts = [
    { name: "Quail Egg - Standard", gradeSize: "Standard", weightRange: "10-12g", basePrice: 2.0, stock: 30000 },
    { name: "Quail Egg - Premium", gradeSize: "Premium", weightRange: ">12g", basePrice: 2.5, stock: 15000 },
  ];

  const allProductData = [
    ...chickenProducts.map((p) => ({ ...p, poultryType: "CHICKEN" as const })),
    ...duckProducts.map((p) => ({ ...p, poultryType: "DUCK" as const })),
    ...gooseProducts.map((p) => ({ ...p, poultryType: "GOOSE" as const })),
    ...quailProducts.map((p) => ({ ...p, poultryType: "QUAIL" as const })),
  ];

  for (const pd of allProductData) {
    const product = await prisma.product.create({
      data: {
        name: pd.name,
        poultryType: pd.poultryType,
        gradeSize: pd.gradeSize,
        weightRange: pd.weightRange,
        basePrice: pd.basePrice,
        stockQuantity: pd.stock,
        description: `Fresh ${pd.poultryType.toLowerCase()} eggs, grade ${pd.gradeSize}, weight ${pd.weightRange}`,
      },
    });

    // Create pricing tiers for each product
    // Food Business gets 15% discount, Retailer gets 25% discount
    await prisma.pricingTier.createMany({
      data: [
        { productId: product.id, accountType: "CONSUMER", price: pd.basePrice },
        { productId: product.id, accountType: "FOOD_BUSINESS", price: Math.round(pd.basePrice * 0.85 * 100) / 100 },
        { productId: product.id, accountType: "RETAILER", price: Math.round(pd.basePrice * 0.75 * 100) / 100 },
      ],
    });
  }

  // ============================================================
  // D3: Seed Sample Orders
  // ============================================================
  const products = await prisma.product.findMany();
  const chickenJumbo = products.find((p) => p.gradeSize === "Size 0" && p.poultryType === "CHICKEN")!;
  const duckLarge = products.find((p) => p.gradeSize === "Large" && p.poultryType === "DUCK")!;

  // B2B order from Grand Hotel
  const order1 = await prisma.order.create({
    data: {
      customerId: customerBusiness.id,
      status: "PROCESSING",
      address: customerBusiness.address,
      subtotal: 3200.0,
      paymentMethod: "BANK_TRANSFER",
      trackingLat: 13.7275,
      trackingLng: 100.5231,
      items: {
        create: [
          { productId: chickenJumbo.id, quantity: 500, priceAtTime: chickenJumbo.basePrice * 0.85 },
        ],
      },
    },
  });

  await prisma.invoice.create({
    data: {
      orderId: order1.id,
      invoiceNumber: "INV-2025-001",
      subtotal: 3200.0,
      tax: 224.0,
      total: 3424.0,
    },
  });

  // B2C order from Somchai
  await prisma.order.create({
    data: {
      customerId: customerConsumer.id,
      status: "DELIVERED",
      address: customerConsumer.address,
      subtotal: 210.0,
      paymentMethod: "CREDIT_CARD",
      items: {
        create: [
          { productId: chickenJumbo.id, quantity: 30, priceAtTime: chickenJumbo.basePrice },
        ],
      },
    },
  });

  // Active subscription for the retailer
  await prisma.subscription.create({
    data: {
      customerId: customerRetailer.id,
      productId: chickenJumbo.id,
      frequency: "WEEKLY",
      quantity: 1000,
      discountPercent: 5,
      status: "ACTIVE",
    },
  });

  console.log("✅ Seeding completed!");
  console.log(`   - ${await prisma.user.count()} users`);
  console.log(`   - ${await prisma.product.count()} products`);
  console.log(`   - ${await prisma.pricingTier.count()} pricing tiers`);
  console.log(`   - ${await prisma.order.count()} orders`);
  console.log(`   - ${await prisma.invoice.count()} invoices`);
  console.log(`   - ${await prisma.subscription.count()} subscriptions`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
