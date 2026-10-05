export function PageHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-forest-900/8 bg-forest-950 py-12 md:py-16">
      <div className="arabesque absolute inset-0 opacity-20" />
      <div className="shell relative">
        {eyebrow ? <span className="eyebrow text-gold-300">{eyebrow}</span> : null}
        <h1 className="mt-2 font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ivory/65">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
