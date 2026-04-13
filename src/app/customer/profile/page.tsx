"use client";

import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SyncIcon from "@mui/icons-material/Sync";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

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
    <div className="py-8 space-y-8">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white border-4 border-gray-900 p-6 space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-500 flex items-center justify-center text-4xl font-black text-white uppercase">
            {profile.fullname.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{profile.fullname}</h2>
            <span className="mt-2 inline-block px-3 py-1 bg-emerald-100 border-2 border-emerald-500 text-emerald-800 text-[10px] font-black uppercase tracking-widest">
              {profile.accountType}
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t-4 border-gray-100">
          {[
            { label: "Email", value: profile.email, icon: <EmailIcon fontSize="medium" /> },
            { label: "Phone", value: profile.phoneNumber, icon: <PhoneIphoneIcon fontSize="medium" /> },
            { label: "Address", value: profile.address, icon: <LocationOnIcon fontSize="medium" /> },
            { label: "Payment", value: profile.paymentInfo, icon: <CreditCardIcon fontSize="medium" /> },
          ].map((field) => (
            <div key={field.label} className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-gray-200 group hover:border-blue-500 transition-colors">
              <span className="text-gray-400 group-hover:text-blue-500 transition-colors flex items-center">{field.icon}</span>
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{field.label}</p>
                <p className="text-sm font-black text-gray-900 uppercase">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Management */}
      <div className="bg-amber-50 border-4 border-amber-500 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-amber-900 uppercase tracking-tight flex items-center gap-3">
            <SyncIcon fontSize="medium" /> Subscription
          </h2>
          <button
            onClick={() => setSubscription((s) => ({ ...s, active: !s.active }))}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-colors ${
              subscription.active
                ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
                : "bg-white text-amber-600 border-amber-300 hover:bg-amber-100"
            }`}
          >
            {subscription.active ? "Active" : "Inactive"}
          </button>
        </div>

        {subscription.active && (
          <div className="space-y-4 border-t-4 border-amber-200 pt-6">
            <div className="p-4 bg-white border-2 border-amber-200">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Product</p>
              <p className="text-sm font-black text-gray-900 uppercase">{subscription.product}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border-2 border-amber-200">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Frequency</p>
                <p className="text-sm font-black text-gray-900 uppercase">{subscription.frequency}</p>
              </div>
              <div className="p-4 bg-white border-2 border-amber-200">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Quantity</p>
                <p className="text-sm font-black text-gray-900 uppercase">{subscription.quantity} units</p>
              </div>
            </div>
            <div className="p-4 bg-amber-200 border-2 border-amber-400 flex items-center gap-3">
              <MonetizationOnIcon fontSize="small" className="text-amber-800" />
              <p className="text-xs font-black text-amber-900 uppercase tracking-widest">5% subscription discount applied</p>
            </div>
          </div>
        )}
      </div>

      {/* Account Type Info */}
      <div className="bg-gray-900 border-4 border-gray-900 p-6 space-y-6 text-white">
        <h2 className="text-xl font-black uppercase tracking-tight">Account Pricing Tier</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { type: "Consumer", discount: "0%", active: true },
            { type: "Business", discount: "15%", active: false },
            { type: "Retailer", discount: "25%", active: false },
          ].map((tier) => (
            <div
              key={tier.type}
              className={`p-4 text-center border-2 ${
                tier.active ? "bg-emerald-500 border-emerald-400" : "bg-gray-800 border-gray-700"
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">{tier.type}</p>
              <p className={`text-xl font-black mt-2 ${tier.active ? "text-white" : "text-gray-500"}`}>
                {tier.discount}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center mt-4">
          Contact KOO Egg sales team to upgrade your account to Business or Retailer tier.
        </p>
      </div>
    </div>
  );
}
