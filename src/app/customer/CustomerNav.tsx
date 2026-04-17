"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";

const tabs = [
  { label: "Shop", href: "/customer", icon: <HomeIcon fontSize="medium" /> },
  { label: "Cart", href: "/customer/cart", icon: <ShoppingCartIcon fontSize="medium" /> },
  { label: "Orders", href: "/customer/orders", icon: <InventoryIcon fontSize="medium" /> },
  { label: "Profile", href: "/customer/profile", icon: <PersonIcon fontSize="medium" /> },
];

export function CustomerNav({ cartCount = 0 }: { cartCount?: number }) {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t-4 border-gray-900 px-2 py-3 z-50">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const showBadge = tab.href === "/customer/cart" && cartCount > 0;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-all duration-200 w-16 relative group ${
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-900"
              }`}
            >
              <div
                className={`transition-transform duration-200 ${
                  isActive ? "-translate-y-1 scale-110" : "group-hover:scale-110"
                } relative`}
              >
                {tab.icon}
                {showBadge ? (
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              {isActive && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
