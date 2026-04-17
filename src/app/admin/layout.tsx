import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "./AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      <AdminSidebar userName={session.name ?? "Admin"} userRole={session.role} />

      <main className="flex-1 overflow-y-auto relative bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-50" />
        <div className="relative z-10 min-h-full">{children}</div>
      </main>
    </div>
  );
}
