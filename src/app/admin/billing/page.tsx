import { prisma } from "@/lib/prisma";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default async function BillingPage() {
  const invoices = await prisma.invoice.findMany({
    include: {
      order: {
        include: {
          customer: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalTax = invoices.reduce((sum, inv) => sum + inv.tax, 0);

  return (
    <div className="p-10 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-gray-900 pb-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase">Billing & Invoices</h1>
          <p className="text-gray-500 mt-2 uppercase text-sm font-bold tracking-widest">B2B Financial Operations Module</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-50 px-8 py-6 border-l-8 border-emerald-500">
             <p className="text-[10px] text-emerald-800 font-black uppercase tracking-widest mb-2">Total Revenue</p>
             <p className="text-3xl font-black text-emerald-600">฿{totalBilled.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 px-8 py-6 border-l-8 border-gray-900">
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Tax Collected</p>
             <p className="text-3xl font-black text-gray-900">฿{totalTax.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 border-4 border-gray-100">
         <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">
            <FilterListIcon className="w-5 h-5" /> Filter By Date
         </button>
         <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-900 text-sm font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
            Export All (CSV)
         </button>
         <div className="h-8 w-1 bg-gray-200 mx-4" />
         <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Automated Billing: LIVE
         </p>
      </div>

      {/* Invoice List */}
      <div className="bg-white border-4 border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-[10px] text-gray-600 uppercase tracking-widest font-black border-b-4 border-gray-200">
              <th className="px-8 py-6">Invoice Details</th>
              <th className="px-8 py-6">Customer / Tier</th>
              <th className="px-8 py-6">Amount</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                      <ReceiptIcon fontSize="medium" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-gray-900 uppercase">{invoice.invoiceNumber}</p>
                      <p className="text-[10px] text-gray-500 mt-1 font-black uppercase tracking-widest">Order #{invoice.orderId.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <p className="text-base font-black text-gray-900 uppercase">{invoice.order.customer.fullname}</p>
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest mt-2 inline-block ${
                       invoice.order.customer.accountType === "FOOD_BUSINESS" ? "bg-blue-500 text-white" :
                       invoice.order.customer.accountType === "RETAILER" ? "bg-emerald-500 text-white" :
                       "bg-gray-900 text-white"
                    }`}>
                       {invoice.order.customer.accountType || "CONSUMER"}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex flex-col">
                      <p className="text-xl font-black text-gray-900">฿{invoice.total.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-widest">Tax: ฿{invoice.tax.toLocaleString()}</p>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                      <CheckCircleIcon className="text-emerald-500" fontSize="small" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">PAID</span>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-3 bg-white border-2 border-gray-200 text-gray-500 hover:text-blue-500 hover:border-blue-500 transition-all hover:scale-110">
                    <PictureAsPdfIcon fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-24 text-center bg-gray-50">
                  <ErrorIcon className="text-gray-300 mb-4" fontSize="large" />
                  <p className="text-gray-500 font-black uppercase text-sm tracking-widest">No invoices generated yet</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
