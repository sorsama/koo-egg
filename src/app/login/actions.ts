"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setSession, clearSession, type SessionRole } from "@/lib/session";

export async function loginAs(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  await setSession({
    userId: user.id,
    role: user.role as SessionRole,
    accountType: user.accountType,
    name: user.fullname,
  });

  if (user.role === "CUSTOMER") redirect("/customer");
  if (user.role === "ADMIN" || user.role === "EMPLOYEE") redirect("/admin");
  redirect("/");
}

export async function loginWithCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    redirect(`/login?error=${encodeURIComponent("Invalid email or password")}`);
  }

  await setSession({
    userId: user.id,
    role: user.role as SessionRole,
    accountType: user.accountType,
    name: user.fullname,
  });

  if (user.role === "CUSTOMER") redirect("/customer");
  if (user.role === "ADMIN" || user.role === "EMPLOYEE") redirect("/admin");
  redirect("/");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}
