type LogoProps = {
  className?: string;
  /** İkinci (ters) Y'yi neon vurguyla göster */
  accent?: boolean;
};

/**
 * YY Monogramı — biri düz, biri ters duran iki "Y".
 * Keskin/geometrik; currentColor ile renk alır.
 */
export function Logo({ className, accent = false }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={5}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {/* Düz Y */}
      <path d="M4 4 L16 20 M28 4 L16 20 M16 20 L16 36" />
      {/* Ters Y */}
      <path
        d="M48 4 L48 20 M36 36 L48 20 M60 36 L48 20"
        stroke={accent ? "#CCFF00" : "currentColor"}
      />
    </svg>
  );
}

/** Logo + kelime markası (yan yana) */
export function Wordmark({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <Logo className="h-6 w-auto text-white" accent />
      <span
        className={`font-display uppercase tracking-[0.22em] leading-none ${
          textClassName ?? "text-base"
        }`}
      >
        Yiğit Yetişken
      </span>
    </span>
  );
}
