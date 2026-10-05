export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = rounded >= star ? 1 : rounded >= star - 0.5 ? 0.5 : 0;
        return (
          <svg
            key={star}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            className="shrink-0"
            role="presentation"
          >
            <defs>
              <linearGradient id={`half-${star}-${size}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="50%" stopColor="#c1a05c" />
                <stop offset="50%" stopColor="#ded5c6" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L1.6 7.7l5.8-.8z"
              fill={fill === 1 ? "#c1a05c" : fill === 0.5 ? `url(#half-${star}-${size})` : "#ded5c6"}
            />
          </svg>
        );
      })}
    </span>
  );
}
