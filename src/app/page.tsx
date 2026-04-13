"use client";

import Link from "next/link";
import { useState } from "react";

const demos = [
  {
    id: "admin",
    title: "Webapp Backend",
    subtitle: "Employee Management Portal",
    description:
      "Inventory management, product administration, stock control (FIFO), order oversight, and real-time analytics dashboard.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    href: "/admin",
    gradient: "from-[#2C3E50] to-[#3498DB]",
    glowColor: "rgba(52, 152, 219, 0.3)",
    features: ["Dashboard Analytics", "Inventory FIFO", "Product Admin", "Invoice Generation"],
    dfdProcesses: ["L1:5 Stock Management", "L1:6 Product Administration"],
  },
  {
    id: "customer",
    title: "Mobile App",
    subtitle: "Customer PWA (B2B & B2C)",
    description:
      "Mobile-first product catalog with tier-based pricing, shopping cart, subscription management, order tracking with GPS simulation.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18" />
      </svg>
    ),
    href: "/customer",
    gradient: "from-[#D4A24E] to-[#F2D98D]",
    glowColor: "rgba(212, 162, 78, 0.3)",
    features: ["Product Catalog", "Cart & Checkout", "GPS Tracking", "Subscriptions"],
    dfdProcesses: ["L1:1 User Management", "L1:2 Product Browsing", "L1:3 Order Management", "L1:4 Payment Processing"],
  },
  {
    id: "pos",
    title: "POS System",
    subtitle: "Point of Sale Terminal",
    description:
      "Quick-entry point-of-sale for farm-front retail, walk-in customer support, direct inventory sync, and receipt/invoice generation.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
        <path d="M7 15h0M12 15h0M17 15h0" />
      </svg>
    ),
    href: "/pos",
    gradient: "from-[#2D7A4F] to-[#3DA065]",
    glowColor: "rgba(45, 122, 79, 0.3)",
    features: ["Quick Entry", "Walk-in Sales", "Stock Sync", "Receipt Print"],
    dfdProcesses: ["L1:7 POS System"],
  },
];

export default function HomePage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#1A1A2E] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4A24E]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3498DB]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#2D7A4F]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          {/* Logo / Brand */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4A24E] to-[#F2D98D] flex items-center justify-center shadow-lg shadow-[#D4A24E]/20">
              <span className="text-2xl font-black text-[#1A1A2E]">K</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="gradient-text">KOO </span>
            <span className="text-white/90">Integrated Egg</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light">
            Digital Platform Prototype — Select a demo module to explore
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full glass text-[#D4A24E] font-medium">
              Next.js 16
            </span>
            <span className="px-3 py-1 rounded-full glass text-[#3498DB] font-medium">
              PostgreSQL
            </span>
            <span className="px-3 py-1 rounded-full glass text-[#3DA065] font-medium">
              PWA
            </span>
          </div>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          {demos.map((demo) => (
            <Link
              key={demo.id}
              href={demo.href}
              className="group block"
              onMouseEnter={() => setHoveredId(demo.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className="relative rounded-3xl p-8 h-full transition-all-smooth glass hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
                style={{
                  boxShadow:
                    hoveredId === demo.id
                      ? `0 25px 60px ${demo.glowColor}, 0 0 120px ${demo.glowColor}`
                      : "0 4px 30px rgba(0,0,0,0.1)",
                }}
              >
                {/* Gradient Accent Top */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r ${demo.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
                />

                {/* Icon */}
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${demo.gradient} flex items-center justify-center mb-6 text-white shadow-lg transition-all-smooth group-hover:scale-110 group-hover:shadow-xl`}
                  style={{
                    boxShadow: `0 8px 30px ${demo.glowColor}`,
                  }}
                >
                  {demo.icon}
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-white mb-1">{demo.title}</h2>
                <p className="text-sm font-medium text-white/40 mb-4">{demo.subtitle}</p>
                <p className="text-white/60 text-sm leading-relaxed mb-6">{demo.description}</p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {demo.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-white/50">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${demo.gradient}`} />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* DFD Reference */}
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-white/30 mb-2">DFD Processes:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {demo.dfdProcesses.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 text-white/40"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all-smooth">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all-smooth"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-white/30 text-xs space-y-1">
          <p>ITCS224 — Information System Security Engineering</p>
          <p>KOO Integrated Egg Co., Ltd. • Phase 2 Prototype</p>
        </div>
      </div>
    </main>
  );
}
