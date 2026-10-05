import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "dark",
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  tone?: "dark" | "light";
  action?: React.ReactNode;
}) {
  const isLight = tone === "light";
  return (
    <Reveal
      className={`flex flex-col gap-4 ${
        align === "center" ? "items-center text-center" : "items-start text-start"
      }`}
    >
      {eyebrow ? (
        <span className={`eyebrow ${isLight ? "text-gold-300" : ""}`}>{eyebrow}</span>
      ) : null}
      <h2
        className={`max-w-3xl font-display text-3xl leading-[1.25] sm:text-4xl md:text-[2.75rem] ${
          isLight ? "text-ivory" : "text-forest-950"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`max-w-2xl text-[0.98rem] leading-relaxed ${
            isLight ? "text-ivory/70" : "text-forest-800/70"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
      {action}
    </Reveal>
  );
}
