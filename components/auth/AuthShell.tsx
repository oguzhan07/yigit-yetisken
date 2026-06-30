import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="flex min-h-[100svh] items-center justify-center bg-ink px-6 py-28">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-10 flex items-center justify-center gap-3">
          <Logo className="h-7 w-auto text-white" accent />
          <span className="font-display uppercase tracking-[0.22em] text-lg">
            Yiğit Yetişken
          </span>
        </Link>

        <div className="border border-line bg-surface p-8 md:p-10">
          <h1 className="h-display text-4xl text-white">{title}</h1>
          {subtitle && <p className="mt-3 text-sm text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-muted">{footer}</div>
        )}
      </div>
    </section>
  );
}
