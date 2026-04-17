import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, type SessionPayload } from "@/lib/session";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  return user;
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireCustomer(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== "CUSTOMER") redirect("/admin");
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== "ADMIN" && session.role !== "EMPLOYEE") redirect("/customer");
  return session;
}
