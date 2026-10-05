import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { listDeliveryZones, listProducts } from "./queries";
import { priceForSize } from "./localize";
import type { CartLine, Locale } from "./types";

export type OrderWithItems = {
  id: number;
  reference: string;
  customerName: string;
  phone: string;
  email: string | null;
  governorateCode: string;
  governorateNameArabic: string;
  governorateNameEnglish: string;
  city: string;
  addressLine: string;
  notes: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  locale: string;
  createdAt: string;
  items: {
    slug: string;
    nameArabic: string;
    nameEnglish: string;
    sizeMl: number;
    unitPrice: number;
    quantity: number;
  }[];
};

export function generateReference(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `RE7-${stamp}${rand}`;
}

export const EGYPT_PHONE = /^(010|011|012|015)\d{8}$/;

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  email?: string | null;
  governorateCode: string;
  city: string;
  addressLine: string;
  notes?: string | null;
  paymentMethod: "cod";
  locale: Locale;
  lines: CartLine[];
};

export async function createOrder(input: CreateOrderInput) {
  const zones = await listDeliveryZones();
  const zone = zones.find((z) => z.code === input.governorateCode);
  if (!zone) throw new Error("UNKNOWN_GOVERNORATE");

  const catalog = await listProducts();
  const resolved = input.lines
    .map((line) => {
      const product = catalog.find((p) => p.slug === line.slug);
      if (!product) return null;
      const size = product.sizes.find((s) => s.ml === line.sizeMl) ?? product.sizes[0];
      return {
        product,
        sizeMl: size?.ml ?? 50,
        quantity: Math.max(1, Math.min(20, Math.trunc(line.quantity))),
        unitPrice: priceForSize(product, size?.ml ?? 50),
      };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  if (resolved.length === 0) throw new Error("EMPTY_CART");

  const subtotal = resolved.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const freeOver = zone.freeDeliveryOver;
  const deliveryFee = freeOver !== null && subtotal >= freeOver ? 0 : zone.fee;
  const total = subtotal + deliveryFee;
  const reference = generateReference();

  const [order] = await db
    .insert(orders)
    .values({
      reference,
      customerName: input.customerName,
      phone: input.phone,
      email: input.email ?? null,
      governorateCode: zone.code,
      governorateNameArabic: zone.nameArabic,
      governorateNameEnglish: zone.nameEnglish,
      city: input.city,
      addressLine: input.addressLine,
      notes: input.notes ?? null,
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      total: total.toFixed(2),
      paymentMethod: input.paymentMethod,
      paymentStatus: "cod_pending",
      status: "new",
      locale: input.locale,
    })
    .returning();

  await db.insert(orderItems).values(
    resolved.map((item) => ({
      orderId: order.id,
      productId: item.product.id,
      slug: item.product.slug,
      nameArabic: item.product.nameArabic,
      nameEnglish: item.product.nameEnglish,
      sizeMl: item.sizeMl,
      unitPrice: item.unitPrice.toFixed(2),
      quantity: item.quantity,
    })),
  );

  return {
    reference: order.reference,
    subtotal,
    deliveryFee,
    total,
    zone,
    items: resolved.map((item) => ({
      nameArabic: item.product.nameArabic,
      nameEnglish: item.product.nameEnglish,
      sizeMl: item.sizeMl,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
}

function mapOrder(
  order: typeof orders.$inferSelect,
  items: (typeof orderItems.$inferSelect)[],
): OrderWithItems {
  return {
    id: order.id,
    reference: order.reference,
    customerName: order.customerName,
    phone: order.phone,
    email: order.email,
    governorateCode: order.governorateCode,
    governorateNameArabic: order.governorateNameArabic,
    governorateNameEnglish: order.governorateNameEnglish,
    city: order.city,
    addressLine: order.addressLine,
    notes: order.notes,
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    total: Number(order.total),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    locale: order.locale,
    createdAt: order.createdAt.toISOString(),
    items: items.map((item) => ({
      slug: item.slug,
      nameArabic: item.nameArabic,
      nameEnglish: item.nameEnglish,
      sizeMl: item.sizeMl,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity,
    })),
  };
}

export async function getOrderByReference(reference: string): Promise<OrderWithItems | null> {
  try {
    const rows = await db.select().from(orders).where(eq(orders.reference, reference)).limit(1);
    if (rows.length === 0) return null;
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, rows[0].id));
    return mapOrder(rows[0], items);
  } catch {
    return null;
  }
}

export async function listOrders(limit = 60): Promise<OrderWithItems[]> {
  try {
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
    if (rows.length === 0) return [];
    const allItems = await db.select().from(orderItems);
    return rows.map((row) =>
      mapOrder(
        row,
        allItems.filter((item) => item.orderId === row.id),
      ),
    );
  } catch {
    return [];
  }
}

export async function updateOrderStatus(reference: string, status: string) {
  await db.update(orders).set({ status }).where(eq(orders.reference, reference));
}
