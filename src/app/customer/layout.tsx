"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { label: "Shop", href: "/customer", icon: "🏠" },
    { label: "Cart", href: "/customer/cart", icon: "🛒" },
    { label: "Orders", href: "/customer/orders", icon: "📦" },
    { label: "Profile", href: "/customer/profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F1A] max-w-md mx-auto relative" style={{ minHeight: "100dvh" }}>
      {/* Top Bar */}
      <header className="sticky top-0 z-50 glass px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A24E] to-[#F2D98D] flex items-center justify-center">
            <span className="text-xs font-black text-[#1A1A2E]">K</span>
          </div>
          <span className="text-sm font-bold text-white">KOO Egg</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[10px] font-medium">
            Consumer
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="pb-20 px-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass border-t border-white/5 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all-smooth ${
                  isActive ? "text-[#D4A24E]" : "text-white/40 hover:text-white/60"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-[10px] font-medium">{tab.label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-[#D4A24E]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
