import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { PageHeader } from "@/components/layout/PageHeader";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.cart.title,
    description:
      "سلة التسوق في ريحان — راجع عطرياتك وأكمل الطلب بالدفع عند الاستلام في كل محافظات مصر.",
    robots: { index: false, follow: true },
  };
}

export default async function CartPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader title={t.cart.title} subtitle={t.cart.deliveryNote} />
      <CartView />
    </>
  );
}
