import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SyncIcon from "@mui/icons-material/Sync";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth";
import SubscriptionCancelClient from "./SubscriptionCancelClient";

export const dynamic = "force-dynamic";

export default async function CustomerProfilePage() {
  const session = await requireCustomer();
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) throw new Error("User not found");

  const subscriptions = await prisma.subscription.findMany({
    where: { customerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const productIds = Array.from(new Set(subscriptions.map((s) => s.productId).filter(Boolean))) as string[];
  const products = productIds.length ? await prisma.product.findMany({ where: { id: { in: productIds } } }) : [];
  const productsById = new Map(products.map((p) => [p.id, p]));

  const accountType = user.accountType ?? "CONSUMER";

  return (
    <div className="py-8 space-y-8">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">My Profile</h1>

      <div className="bg-white border-4 border-gray-900 p-6 space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-500 flex items-center justify-center text-4xl font-black text-white uppercase">
            {user.fullname.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{user.fullname}</h2>
            <span className="mt-2 inline-block px-3 py-1 bg-emerald-100 border-2 border-emerald-500 text-emerald-800 text-[10px] font-black uppercase tracking-widest">
              {accountType}
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t-4 border-gray-100">
          {[
            { label: "Email", value: user.email, icon: <EmailIcon fontSize="medium" /> },
            { label: "Phone", value: user.phoneNumber ?? "—", icon: <PhoneIphoneIcon fontSize="medium" /> },
            { label: "Address", value: user.address ?? "—", icon: <LocationOnIcon fontSize="medium" /> },
            { label: "Payment", value: user.paymentInfo ?? "—", icon: <CreditCardIcon fontSize="medium" /> },
          ].map((field) => (
            <div
              key={field.label}
              className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-gray-200 group hover:border-blue-500 transition-colors"
            >
              <span className="text-gray-400 group-hover:text-blue-500 transition-colors flex items-center">{field.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{field.label}</p>
                <p className="text-sm font-black text-gray-900 uppercase truncate">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border-4 border-amber-500 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-amber-900 uppercase tracking-tight flex items-center gap-3">
            <SyncIcon fontSize="medium" /> Subscriptions
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-800">
            {subscriptions.length} total
          </span>
        </div>

        {subscriptions.length === 0 ? (
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-900">
            No subscriptions. Create one from any product page.
          </p>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub) => {
              const prod = sub.productId ? productsById.get(sub.productId) : null;
              const isActive = sub.status === "ACTIVE";
              return (
                <div
                  key={sub.id}
                  className={`border-4 p-4 space-y-3 ${
                    isActive ? "border-amber-500 bg-white" : "border-gray-300 bg-gray-50 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">{sub.frequency}</p>
                      <p className="text-sm font-black text-gray-900 uppercase">{prod?.name ?? "Product"}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${
                        isActive ? "bg-emerald-500 text-white border-emerald-600" : "bg-gray-200 text-gray-700 border-gray-400"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-widest text-amber-900">
                    <div className="p-2 bg-amber-100">Qty {sub.quantity}</div>
                    <div className="p-2 bg-amber-100">Discount {sub.discountPercent}%</div>
                  </div>
                  {!isActive && sub.inactiveReason ? (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 text-[10px] font-bold uppercase tracking-widest text-red-900">
                      Reason: {sub.inactiveReason}
                    </div>
                  ) : null}
                  {isActive ? (
                    <SubscriptionCancelClient subscriptionId={sub.id} />
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-gray-900 border-4 border-gray-900 p-6 space-y-6 text-white">
        <h2 className="text-xl font-black uppercase tracking-tight">Account Pricing Tier</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { type: "Consumer", key: "CONSUMER", discount: "0%" },
            { type: "Business", key: "FOOD_BUSINESS", discount: "15%" },
            { type: "Retailer", key: "RETAILER", discount: "25%" },
          ].map((tier) => {
            const active = tier.key === accountType;
            return (
              <div
                key={tier.type}
                className={`p-4 text-center border-2 ${
                  active ? "bg-emerald-500 border-emerald-400" : "bg-gray-800 border-gray-700"
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">{tier.type}</p>
                <p className={`text-xl font-black mt-2 ${active ? "text-white" : "text-gray-500"}`}>
                  {tier.discount}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <form action="/logout" method="get">
        <button className="w-full py-4 bg-gray-900 text-white font-black uppercase tracking-widest text-xs hover:bg-black">
          Log Out
        </button>
      </form>
    </div>
  );
}
