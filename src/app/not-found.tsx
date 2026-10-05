import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="eyebrow">RE7AN</span>
      <h1 className="mt-4 font-display text-4xl text-forest-950 sm:text-5xl">
        الصفحة مش موجودة
      </h1>
      <p className="mt-3 max-w-md text-[0.92rem] leading-relaxed text-forest-800/65">
        يبدو إن الرابط اللي فتحته مش موجود في متجر ريحان. تقدر ترجع للرئيسية أو تتفرج على العطور.
      </p>
      <p className="mt-2 max-w-md text-[0.85rem] text-forest-800/50">
        This page could not be found.
      </p>
      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          الرئيسية
        </Link>
        <Link href="/shop" className="btn btn-outline">
          اكتشف العطور
        </Link>
      </div>
    </div>
  );
}
