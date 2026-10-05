import type { Metadata } from "next";
import { listDeliveryZones } from "@/lib/queries";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { PageHeader } from "@/components/layout/PageHeader";
import { getI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.checkout.title,
    description:
      "إتمام الطلب في ريحان — الاسم، رقم الموبايل، المحافظة، العنوان، والدفع عند الاستلام في كل محافظات مصر.",
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage() {
  const { t } = await getI18n();
  const zones = await listDeliveryZones();

  return (
    <>
      <PageHeader title={t.checkout.title} subtitle={t.checkout.subtitle} />
      <CheckoutView zones={zones} />
    </>
  );
}
