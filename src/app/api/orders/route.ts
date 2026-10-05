import { NextResponse } from "next/server";
import { createOrder, EGYPT_PHONE } from "@/lib/orders";
import type { CartLine, Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

type OrderPayload = {
  customerName?: string;
  phone?: string;
  email?: string;
  governorateCode?: string;
  city?: string;
  addressLine?: string;
  notes?: string;
  paymentMethod?: string;
  locale?: string;
  lines?: CartLine[];
};

/**
 * Order endpoint. Only cash-on-delivery is chargeable today — the payload shape
 * already carries `paymentMethod` so an Egyptian gateway (Paymob / Fawry /
 * Stripe) can be wired in later without changing the frontend contract.
 */
export async function POST(request: Request) {
  let body: OrderPayload;
  try {
    body = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }

  const customerName = (body.customerName ?? "").trim();
  const phone = (body.phone ?? "").replace(/[\s-]/g, "");
  const governorateCode = (body.governorateCode ?? "").trim();
  const city = (body.city ?? "").trim();
  const addressLine = (body.addressLine ?? "").trim();
  const paymentMethod = body.paymentMethod === "card" || body.paymentMethod === "wallet" ? body.paymentMethod : "cod";
  const locale: Locale = body.locale === "en" ? "en" : "ar";
  const lines = Array.isArray(body.lines) ? body.lines.filter((l) => l && l.slug) : [];

  const errors: Record<string, string> = {};
  if (customerName.length < 3) errors.customerName = "NAME";
  if (!EGYPT_PHONE.test(phone)) errors.phone = "PHONE";
  if (!governorateCode) errors.governorateCode = "GOVERNORATE";
  if (city.length < 2) errors.city = "CITY";
  if (addressLine.length < 6) errors.addressLine = "ADDRESS";
  if (lines.length === 0) errors.lines = "EMPTY_CART";
  if (paymentMethod !== "cod") errors.paymentMethod = "PAYMENT_NOT_AVAILABLE";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const order = await createOrder({
      customerName,
      phone,
      email: body.email?.trim() || null,
      governorateCode,
      city,
      addressLine,
      notes: body.notes?.trim() || null,
      paymentMethod: "cod",
      locale,
      lines,
    });
    return NextResponse.json({ ok: true, ...order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "SERVER_ERROR";
    const status = message === "UNKNOWN_GOVERNORATE" || message === "EMPTY_CART" ? 422 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
