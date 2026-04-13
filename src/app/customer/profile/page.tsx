"use client";

import { useState } from "react";

export default function CustomerProfilePage() {
  const [profile] = useState({
    fullname: "Somchai Jaidee",
    email: "somchai@email.com",
    phoneNumber: "081-234-5678",
    address: "123 Sukhumvit Rd, Bangkok 10110",
    accountType: "CONSUMER",
    paymentInfo: "Visa **** 4242",
  });

  const [subscription, setSubscription] = useState({
    active: false,
    frequency: "WEEKLY",
    product: "Chicken Egg - Jumbo (Size 0)",
    quantity: 30,
  });

  return (
    <div className="py-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">My Profile</h1>

      {/* Profile Card */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4A24E] to-[#F2D98D] flex items-center justify-center text-2xl font-black text-[#1A1A2E]">
            {profile.fullname.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{profile.fullname}</h2>
            <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[10px] font-medium">
              {profile.accountType}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: "Email", value: profile.email, icon: "📧" },
            { label: "Phone", value: profile.phoneNumber, icon: "📱" },
            { label: "Address", value: profile.address, icon: "📍" },
            { label: "Payment", value: profile.paymentInfo, icon: "💳" },
          ].map((field) => (
            <div key={field.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
              <span className="text-sm">{field.icon}</span>
              <div className="flex-1">
                <p className="text-[10px] text-white/30 uppercase tracking-wider">{field.label}</p>
                <p className="text-sm text-white/80">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Management */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">🔄 Subscription</h2>
          <button
            onClick={() => setSubscription((s) => ({ ...s, active: !s.active }))}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all-smooth ${
              subscription.active
                ? "bg-green-500/10 text-green-400"
                : "bg-white/5 text-white/40"
            }`}
          >
            {subscription.active ? "Active" : "Inactive"}
          </button>
        </div>

        {subscription.active && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.03]">
              <p className="text-[10px] text-white/30 uppercase">Product</p>
              <p className="text-sm text-white/80">{subscription.product}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03]">
                <p className="text-[10px] text-white/30 uppercase">Frequency</p>
                <p className="text-sm text-white/80">{subscription.frequency}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03]">
                <p className="text-[10px] text-white/30 uppercase">Quantity</p>
                <p className="text-sm text-white/80">{subscription.quantity} units</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#D4A24E]/5 flex items-center gap-2">
              <span className="text-sm">💰</span>
              <p className="text-xs text-[#D4A24E]">5% subscription discount applied</p>
            </div>
          </div>
        )}
      </div>

      {/* Account Type Info */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Account Pricing Tier</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { type: "Consumer", discount: "0%", active: true },
            { type: "Business", discount: "15%", active: false },
            { type: "Retailer", discount: "25%", active: false },
          ].map((tier) => (
            <div
              key={tier.type}
              className={`p-3 rounded-xl text-center ${
                tier.active ? "bg-[#D4A24E]/10 border border-[#D4A24E]/30" : "bg-white/[0.03]"
              }`}
            >
              <p className="text-xs font-medium text-white/70">{tier.type}</p>
              <p className={`text-sm font-bold mt-1 ${tier.active ? "text-[#D4A24E]" : "text-white/30"}`}>
                {tier.discount}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/30">
          Contact KOO Egg sales team to upgrade your account to Business or Retailer tier for better pricing.
        </p>
      </div>
    </div>
  );
}
