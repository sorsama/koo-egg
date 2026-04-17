import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { loginAs, loginWithCredentials } from "./actions";

export const dynamic = "force-dynamic";

function accountBadge(accountType: string | null | undefined) {
  if (accountType === "FOOD_BUSINESS") return "Food Business";
  if (accountType === "RETAILER") return "Retailer";
  if (accountType === "CONSUMER") return "Consumer";
  return "";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const session = await getSession();
  if (session) {
    if (session.role === "CUSTOMER") redirect("/customer");
    if (session.role === "ADMIN" || session.role === "EMPLOYEE") redirect("/admin");
  }

  const sp = await searchParams;
  const error = sp.error;

  const users = await prisma.user.findMany({ orderBy: [{ role: "asc" }, { fullname: "asc" }] });
  const customers = users.filter((u) => u.role === "CUSTOMER");
  const admins = users.filter((u) => u.role === "ADMIN" || u.role === "EMPLOYEE");

  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-500 flex items-center justify-center">
              <span className="text-2xl font-black text-white">K</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900">
              KOO <span className="text-blue-500">Egg</span>
            </h1>
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
            Demo Login — One-click access
          </p>
          {error ? (
            <p className="mt-4 inline-block bg-red-100 border-4 border-red-500 text-red-900 font-black uppercase tracking-widest text-xs px-4 py-2">
              {error}
            </p>
          ) : null}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Customer / Mobile App */}
          <section className="border-4 border-emerald-500 bg-emerald-50 p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-black uppercase text-emerald-900 tracking-tight">Mobile App</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">Customer (B2B &amp; B2C)</p>
            </div>
            <div className="space-y-3">
              {customers.map((u) => (
                <form key={u.id} action={loginAs.bind(null, u.id)}>
                  <button
                    type="submit"
                    className="w-full text-left bg-white border-4 border-emerald-500 p-4 hover:bg-emerald-100 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-black text-sm text-gray-900 truncate">{u.fullname}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 truncate">
                          {u.email}
                        </p>
                      </div>
                      <span className="shrink-0 px-2 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">
                        {accountBadge(u.accountType)}
                      </span>
                    </div>
                  </button>
                </form>
              ))}
            </div>
          </section>

          {/* Admin Web App + POS */}
          <section className="border-4 border-blue-500 bg-blue-50 p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-black uppercase text-blue-900 tracking-tight">Web App</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-700">Admin Portal</p>
            </div>
            <div className="space-y-3">
              {admins.map((u) => (
                <form key={u.id} action={loginAs.bind(null, u.id)}>
                  <button
                    type="submit"
                    className="w-full text-left bg-white border-4 border-blue-500 p-4 hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-black text-sm text-gray-900 truncate">{u.fullname}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 truncate">
                          {u.email}
                        </p>
                      </div>
                      <span className="shrink-0 px-2 py-1 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest">
                        {u.role}
                      </span>
                    </div>
                  </button>
                </form>
              ))}
            </div>
          </section>

          {/* POS Terminal */}
          <section className="border-4 border-amber-500 bg-amber-50 p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-black uppercase text-amber-900 tracking-tight">POS Terminal</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700">Point of Sale</p>
            </div>
            <div className="space-y-3">
              {admins.map((u) => (
                <form key={u.id} action={loginAs.bind(null, u.id)}>
                  <button
                    type="submit"
                    className="w-full text-left bg-white border-4 border-amber-500 p-4 hover:bg-amber-100 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-black text-sm text-gray-900 truncate">{u.fullname}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 truncate">
                        Sign in as {u.role} → then go to /pos
                      </p>
                    </div>
                  </button>
                </form>
              ))}
              <Link
                href="/pos"
                className="block text-center px-4 py-3 bg-amber-500 text-white font-black uppercase tracking-widest text-xs hover:bg-amber-600"
              >
                Open POS →
              </Link>
            </div>
          </section>
        </div>

        {/* Credential form */}
        <div className="mt-16 max-w-md mx-auto border-4 border-gray-900 bg-white p-6">
          <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-4">
            Or sign in with email
          </h3>
          <form action={loginWithCredentials} className="space-y-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full border-4 border-gray-900 px-3 py-2 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                defaultValue="demo1234"
                className="w-full border-4 border-gray-900 px-3 py-2 font-bold"
              />
              <p className="mt-1 text-[10px] font-bold text-gray-500">
                Demo password: <code className="bg-gray-100 px-1">demo1234</code>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 font-black uppercase tracking-widest text-xs hover:bg-black"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
