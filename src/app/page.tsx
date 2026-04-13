import Link from "next/link";

const demos = [
  {
    id: "admin",
    title: "Webapp Backend",
    subtitle: "Employee Management Portal",
    description: "Inventory management, product administration, stock control (FIFO), order oversight, and real-time analytics dashboard.",
    href: "/admin",
    bgColor: "bg-blue-50",
    hoverBgColor: "hover:bg-blue-100",
    textColor: "text-blue-900",
    accentColor: "bg-blue-500",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <rect x="2" y="3" width="20" height="14" rx="0" ry="0" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    features: ["Dashboard Analytics", "Inventory FIFO", "Product Admin", "Invoice Generation"],
    dfdProcesses: ["L1:5 Stock Management", "L1:6 Product Admin"],
  },
  {
    id: "customer",
    title: "Mobile App",
    subtitle: "Customer PWA (B2B & B2C)",
    description: "Mobile-first product catalog with tier-based pricing, shopping cart, subscription management, order tracking with GPS simulation.",
    href: "/customer",
    bgColor: "bg-emerald-50",
    hoverBgColor: "hover:bg-emerald-100",
    textColor: "text-emerald-900",
    accentColor: "bg-emerald-500",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <rect x="5" y="2" width="14" height="20" rx="0" ry="0" />
        <line x1="12" y1="18" x2="12" y2="18" />
      </svg>
    ),
    features: ["Product Catalog", "Cart & Checkout", "GPS Tracking", "Subscriptions"],
    dfdProcesses: ["L1:1 User Management", "L1:2 Product Browsing"],
  },
  {
    id: "pos",
    title: "POS System",
    subtitle: "Point of Sale Terminal",
    description: "Quick-entry point-of-sale for farm-front retail, walk-in customer support, direct inventory sync, and receipt/invoice generation.",
    href: "/pos",
    bgColor: "bg-amber-50",
    hoverBgColor: "hover:bg-amber-100",
    textColor: "text-amber-900",
    accentColor: "bg-amber-500",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <rect x="1" y="4" width="22" height="16" rx="0" ry="0" />
        <line x1="1" y1="10" x2="23" y2="10" />
        <path d="M7 15h0M12 15h0M17 15h0" />
      </svg>
    ),
    features: ["Quick Entry", "Walk-in Sales", "Stock Sync", "Receipt Print"],
    dfdProcesses: ["L1:7 POS System"],
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-50 rounded-full translate-y-1/3 -translate-x-1/4 opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-6 w-full">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-900 flex items-center justify-center rounded-none">
              <span className="text-3xl font-black text-white tracking-tighter">K</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 uppercase">
            KOO <span className="text-blue-500">Integrated Egg</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Digital Platform Prototype — Select a demo module to explore
          </p>
          <div className="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-wider">
            <span className="px-4 py-2 bg-gray-100 text-gray-900">Next.js 16</span>
            <span className="px-4 py-2 bg-blue-100 text-blue-900">PostgreSQL</span>
            <span className="px-4 py-2 bg-emerald-100 text-emerald-900">PWA</span>
          </div>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {demos.map((demo) => (
            <Link key={demo.id} href={demo.href} className="group block h-full">
              <div className={`h-full p-8 rounded-lg ${demo.bgColor} ${demo.hoverBgColor} transition-all duration-200 hover:scale-[1.02] cursor-pointer flex flex-col`}>
                
                {/* Icon */}
                <div className={`w-20 h-20 flex items-center justify-center mb-8 rounded-none ${demo.accentColor} transition-transform duration-200 group-hover:scale-110`}>
                  {demo.icon}
                </div>

                {/* Content */}
                <h2 className={`text-3xl font-black ${demo.textColor} mb-2 uppercase tracking-tight`}>{demo.title}</h2>
                <p className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-widest">{demo.subtitle}</p>
                <p className="text-gray-700 text-base leading-relaxed mb-8 flex-grow">{demo.description}</p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {demo.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm font-bold text-gray-800">
                      <div className={`w-3 h-3 ${demo.accentColor}`} />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* DFD Reference */}
                <div className="pt-6 border-t-4 border-white/40">
                  <div className="flex flex-wrap gap-2">
                    {demo.dfdProcesses.map((p) => (
                      <span key={p} className="px-3 py-1 bg-white text-gray-800 text-[10px] font-black uppercase tracking-widest">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-20 text-center font-bold text-gray-400 text-xs uppercase tracking-widest space-y-2">
          <p>ITCS224 — Information System Security Engineering</p>
          <p>KOO Integrated Egg Co., Ltd. • Phase 2 Prototype</p>
        </div>
      </div>
    </main>
  );
}
