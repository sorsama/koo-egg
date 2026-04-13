"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    label: "Product Admin",
    href: "/admin/products",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    label: "Fulfillment",
    href: "/admin/orders",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: "Billing",
    href: "/admin/billing",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-50 border-r-4 border-gray-100 flex flex-col relative overflow-hidden z-10">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
          backgroundImage: `radial-gradient(#111827 2px, transparent 2px)`,
          backgroundSize: '24px 24px'
        }}></div>

        {/* Logo */}
        <Link href="/" className="p-8 flex items-center gap-4 hover:bg-gray-200 transition-colors border-b-4 border-gray-100 relative z-10">
          <div className="w-12 h-12 bg-blue-500 flex items-center justify-center rounded-none">
            <span className="text-xl font-black text-white">K</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">KOO ERP</h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Admin Portal</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 relative z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-none text-sm font-black uppercase tracking-widest transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500 text-white translate-x-2"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-200 hover:translate-x-1"
                }`}
              >
                <span className={isActive ? "text-white" : "text-gray-400"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-6 border-t-4 border-gray-100 bg-white relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-900 flex items-center justify-center text-white text-sm font-black">
              AA
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-wider">Alex Agron</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Employee</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-white">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-50" />
        
        <div className="relative z-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
