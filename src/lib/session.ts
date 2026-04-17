import { cookies } from "next/headers";

export type SessionRole = "CUSTOMER" | "EMPLOYEE" | "ADMIN";

export type SessionPayload = {
  userId: string;
  role: SessionRole;
  accountType?: string | null;
  name?: string;
};

const COOKIE_NAME = "koo_session";
const MAX_AGE = 60 * 60 * 24 * 7;

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSession(payload: SessionPayload) {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export function parseSessionCookieValue(value: string | undefined): SessionPayload | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
