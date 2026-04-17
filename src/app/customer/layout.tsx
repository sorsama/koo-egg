import Link from "next/link";
import { requireCustomer } from "@/lib/auth";
import { getCartCount } from "@/lib/cart";
import { CustomerNav } from "./CustomerNav";

export const dynamic = "force-dynamic";

const accountLabels: Record<string, { label: string; color: string }> = {
  CONSUMER: { label: "Consumer", color: "bg-emerald-100 border-emerald-500 text-emerald-800" },
  FOOD_BUSINESS: { label: "Food Business", color: "bg-blue-100 border-blue-500 text-blue-800" },
  RETAILER: { label: "Retailer", color: "bg-amber-100 border-amber-500 text-amber-800" },
};

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await requireCustomer();
  const cartCount = await getCartCount();
  const badge = session.accountType ? accountLabels[session.accountType] : null;

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative font-sans" style={{ minHeight: "100dvh" }}>
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(#9CA3AF 2px, transparent 2px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <header className="sticky top-0 z-50 bg-white border-b-4 border-gray-900 px-6 py-5 flex items-center justify-between">
        <Link href="/customer" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 flex items-center justify-center font-black text-white text-lg hover:scale-105 transition-transform">
            K
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-gray-900 uppercase tracking-tight leading-tight">KOO Egg</span>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-tight truncate max-w-[140px]">
              {session.name}
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {badge ? (
            <span className={`px-3 py-1 border-2 text-[10px] font-black uppercase tracking-widest ${badge.color}`}>
              {badge.label}
            </span>
          ) : null}
          <a
            href="/logout"
            className="px-2 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black"
            title="Log out"
          >
            Out
          </a>
        </div>
      </header>

      <main className="pb-24 px-6 relative z-10">{children}</main>

      <CustomerNav cartCount={cartCount} />
    </div>
  );
}
