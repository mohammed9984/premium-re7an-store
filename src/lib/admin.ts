import { cookies } from "next/headers";

const ADMIN_COOKIE = "re7an_admin";

export function adminPasscode(): string {
  return process.env.ADMIN_PASSCODE ?? "re7an-admin";
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === "1";
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;
