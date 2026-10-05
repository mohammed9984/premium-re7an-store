"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { deliveryZones, orders } from "@/db/schema";
import { ADMIN_COOKIE_NAME, adminPasscode } from "@/lib/admin";

export async function login(formData: FormData) {
  const passcode = String(formData.get("passcode") ?? "");
  if (passcode !== adminPasscode()) return;
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  revalidatePath("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  revalidatePath("/admin");
}

export async function setOrderStatus(formData: FormData) {
  const reference = String(formData.get("reference") ?? "");
  const status = String(formData.get("status") ?? "new");
  if (!reference) return;
  const allowed = ["new", "confirmed", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) return;
  await db.update(orders).set({ status }).where(eq(orders.reference, reference));
  revalidatePath("/admin");
}

export async function setZoneFee(formData: FormData) {
  const code = String(formData.get("code") ?? "");
  const fee = Number(formData.get("fee"));
  const etaArabic = String(formData.get("etaArabic") ?? "");
  const etaEnglish = String(formData.get("etaEnglish") ?? "");
  if (!code || Number.isNaN(fee) || fee < 0) return;

  await db
    .update(deliveryZones)
    .set({
      fee: fee.toFixed(2),
      ...(etaArabic ? { etaArabic } : {}),
      ...(etaEnglish ? { etaEnglish } : {}),
    })
    .where(eq(deliveryZones.code, code));
  revalidatePath("/admin");
  revalidatePath("/shipping");
}
