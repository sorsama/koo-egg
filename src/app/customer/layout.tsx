"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { label: "Shop", href: "/customer", icon: <HomeIcon fontSize="medium" /> },
    { label: "Cart", href: "/customer/cart", icon: <ShoppingCartIcon fontSize="medium" /> },
    { label: "Orders", href: "/customer/orders", icon: <InventoryIcon fontSize="medium" /> },
    { label: "Profile", href: "/customer/profile", icon: <PersonIcon fontSize="medium" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative font-sans" style={{ minHeight: "100dvh" }}>
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: `radial-gradient(#9CA3AF 2px, transparent 2px)`,
        backgroundSize: '24px 24px'
      }} />

      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-gray-900 px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 flex items-center justify-center font-black text-white text-lg hover:scale-105 transition-transform">
            K
          </div>
          <span className="text-xl font-black text-gray-900 uppercase tracking-tight">KOO Egg</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 border-2 border-emerald-500 text-emerald-800 text-[10px] font-black uppercase tracking-widest">
            Consumer
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="pb-24 px-6 relative z-10">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t-4 border-gray-900 px-2 py-3 z-50">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-all duration-200 w-16 relative group ${
                  isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-900"
                }`}
              >
                <div className={`transition-transform duration-200 ${isActive ? "-translate-y-1 scale-110" : "group-hover:scale-110"}`}>
                  {tab.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                {isActive && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
