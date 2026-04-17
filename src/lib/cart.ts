import { cookies } from "next/headers";

export type CartItem = {
  productId: string;
  quantity: number;
};

const COOKIE_NAME = "koo_cart";
const MAX_AGE = 60 * 60 * 24 * 30;

export async function getCart(): Promise<CartItem[]> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (it): it is CartItem =>
        typeof it?.productId === "string" && Number.isFinite(it?.quantity) && it.quantity > 0
    );
  } catch {
    return [];
  }
}

export async function writeCart(items: CartItem[]) {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function addToCart(productId: string, quantity = 1) {
  const items = await getCart();
  const found = items.find((it) => it.productId === productId);
  if (found) found.quantity += quantity;
  else items.push({ productId, quantity });
  await writeCart(items);
}

export async function updateCartQuantity(productId: string, quantity: number) {
  const items = await getCart();
  if (quantity <= 0) {
    await writeCart(items.filter((it) => it.productId !== productId));
    return;
  }
  const found = items.find((it) => it.productId === productId);
  if (found) found.quantity = quantity;
  else items.push({ productId, quantity });
  await writeCart(items);
}

export async function removeFromCart(productId: string) {
  const items = await getCart();
  await writeCart(items.filter((it) => it.productId !== productId));
}

export async function clearCart() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCartCount(): Promise<number> {
  const items = await getCart();
  return items.reduce((sum, it) => sum + it.quantity, 0);
}
