import type { Metadata } from "next";
import { listDeliveryZones, listProducts } from "@/lib/queries";
import { listOrders } from "@/lib/orders";
import { isAdminAuthenticated } from "@/lib/admin";
import { login, logout, setOrderStatus, setZoneFee } from "./actions";
import { formatPrice } from "@/lib/localize";
import { getI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | RE7AN",
  robots: { index: false, follow: false },
};

const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"] as const;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await getI18n();
  const params = await searchParams;
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return (
      <div className="shell flex min-h-[60vh] items-center justify-center py-16">
        <form action={login} className="card w-full max-w-sm space-y-4 p-7">
          <div>
            <p className="eyebrow">RE7AN</p>
            <h1 className="mt-2 font-display text-2xl text-forest-950">
              {locale === "ar" ? "لوحة تحكم المتجر" : "Store admin"}
            </h1>
            <p className="mt-2 text-[0.8rem] text-forest-800/60">
              {locale === "ar"
                ? "ادخل رمز الدخول لعرض الطلبات وتعديل مصاريف التوصيل."
                : "Enter the passcode to view orders and edit delivery fees."}
            </p>
          </div>
          <input
            name="passcode"
            type="password"
            required
            placeholder={locale === "ar" ? "رمز الدخول" : "Passcode"}
            className="field"
          />
          {params.error ? (
            <p className="text-[0.75rem] text-cocoa-600">
              {locale === "ar" ? "رمز غير صحيح" : "Wrong passcode"}
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary w-full">
            {locale === "ar" ? "دخول" : "Sign in"}
          </button>
          <p className="text-[0.68rem] leading-relaxed text-forest-800/45">
            {locale === "ar"
              ? "النسخة التجريبية: الرمز الافتراضي re7an-admin (يمكن تغييره من ADMIN_PASSCODE)."
              : "Prototype: default passcode is re7an-admin (override with ADMIN_PASSCODE)."}
          </p>
        </form>
      </div>
    );
  }

  const [orders, zones, products] = await Promise.all([
    listOrders(40),
    listDeliveryZones(),
    listProducts(),
  ]);

  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="shell py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">RE7AN</p>
          <h1 className="mt-2 font-display text-3xl text-forest-950">
            {locale === "ar" ? "لوحة تحكم المتجر" : "Store admin"}
          </h1>
          <p className="mt-1 text-[0.82rem] text-forest-800/60">
            {locale === "ar"
              ? "الطلبات ومصاريف التوصيل — كل البيانات من قاعدة البيانات."
              : "Orders and delivery fees — all data from PostgreSQL."}
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className="btn btn-outline">
            {locale === "ar" ? "خروج" : "Sign out"}
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label={locale === "ar" ? "عدد الطلبات" : "Orders"} value={String(orders.length)} />
        <Stat
          label={locale === "ar" ? "إجمالي المبيعات" : "Order value"}
          value={formatPrice(revenue, locale)}
        />
        <Stat
          label={locale === "ar" ? "عدد العطور" : "Active products"}
          value={String(products.length)}
        />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-forest-950">
          {locale === "ar" ? "الطلبات" : "Orders"}
        </h2>
        {orders.length === 0 ? (
          <p className="card mt-4 p-6 text-[0.85rem] text-forest-800/60">
            {locale === "ar"
              ? "مفيش طلبات لسه. جرّب تعمل طلب تجريبي من المتجر."
              : "No orders yet. Place a test order from the storefront."}
          </p>
        ) : (
          <div className="card mt-4 overflow-x-auto">
            <table className="w-full min-w-[46rem] text-[0.8rem]">
              <thead className="bg-ivory-200 text-forest-800">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">Ref</th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {locale === "ar" ? "العميل" : "Customer"}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {locale === "ar" ? "المحافظة" : "Governorate"}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {locale === "ar" ? "الإجمالي" : "Total"}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {locale === "ar" ? "الدفع" : "Payment"}
                  </th>
                  <th className="px-4 py-3 text-start font-semibold">
                    {locale === "ar" ? "الحالة" : "Status"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-900/8">
                {orders.map((order) => (
                  <tr key={order.reference}>
                    <td className="px-4 py-3 font-mono text-[0.72rem]" dir="ltr">
                      {order.reference}
                    </td>
                    <td className="px-4 py-3">
                      <span className="block font-medium text-forest-950">{order.customerName}</span>
                      <span className="block text-[0.72rem] text-forest-800/60" dir="ltr">
                        {order.phone}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-forest-800">
                      {locale === "ar" ? order.governorateNameArabic : order.governorateNameEnglish}
                    </td>
                    <td className="px-4 py-3 font-semibold text-forest-950">
                      {formatPrice(order.total, locale)}
                    </td>
                    <td className="px-4 py-3 text-forest-800">
                      {order.paymentMethod === "cod"
                        ? locale === "ar"
                          ? "كاش عند الاستلام"
                          : "Cash on delivery"
                        : order.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <form action={setOrderStatus} className="flex items-center gap-2">
                        <input type="hidden" name="reference" value={order.reference} />
                        <select
                          name="status"
                          defaultValue={order.status}
                          className="rounded-full border border-forest-900/15 bg-white px-3 py-1.5 text-[0.75rem]"
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {locale === "ar"
                                ? ({
                                    new: "جديد",
                                    confirmed: "تم التأكيد",
                                    shipped: "تم الشحن",
                                    delivered: "تم التوصيل",
                                    cancelled: "ملغي",
                                  } as Record<string, string>)[status]
                                : status}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded-full bg-forest-900 px-3 py-1.5 text-[0.72rem] font-semibold text-ivory"
                        >
                          {locale === "ar" ? "حفظ" : "Save"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-forest-950">
          {locale === "ar" ? "مصاريف التوصيل لكل محافظة" : "Delivery fees by governorate"}
        </h2>
        <p className="mt-1 text-[0.8rem] text-forest-800/60">
          {locale === "ar"
            ? "عدّل السعر أو مدة التوصيل — التغيير يظهر فوراً في المتجر وصفحة الشحن."
            : "Edit the fee or ETA — changes appear immediately across the storefront."}
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {zones.map((zone) => (
            <form key={zone.code} action={setZoneFee} className="card space-y-2 p-4">
              <input type="hidden" name="code" value={zone.code} />
              <div className="flex items-center justify-between">
                <p className="text-[0.86rem] font-semibold text-forest-950">
                  {locale === "ar" ? zone.nameArabic : zone.nameEnglish}
                </p>
                <span className="text-[0.7rem] text-forest-800/45" dir="ltr">
                  {zone.code}
                </span>
              </div>
              <label className="block text-[0.7rem] text-forest-800/60">
                {locale === "ar" ? "مصاريف الشحن (ج.م)" : "Delivery fee (EGP)"}
                <input
                  name="fee"
                  type="number"
                  min={0}
                  step={5}
                  defaultValue={zone.fee}
                  className="field mt-1"
                />
              </label>
              <label className="block text-[0.7rem] text-forest-800/60">
                {locale === "ar" ? "مدة التوصيل (عربي)" : "ETA (Arabic)"}
                <input name="etaArabic" defaultValue={zone.etaArabic} className="field mt-1" />
              </label>
              <label className="block text-[0.7rem] text-forest-800/60">
                {locale === "ar" ? "مدة التوصيل (إنجليزي)" : "ETA (English)"}
                <input name="etaEnglish" defaultValue={zone.etaEnglish} className="field mt-1" dir="ltr" />
              </label>
              <button type="submit" className="btn btn-primary mt-1 w-full py-2.5 text-[0.78rem]">
                {locale === "ar" ? "حفظ" : "Save"}
              </button>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-800/50">{label}</p>
      <p className="mt-2 font-display text-2xl text-forest-950">{value}</p>
    </div>
  );
}
