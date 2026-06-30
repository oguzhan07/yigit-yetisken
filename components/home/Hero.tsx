"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { hero, whatsappUrl } from "@/lib/content";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* Arka plan videosu (parallax) */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 -z-10 scale-110">
        <video
          className="h-full w-full bg-ink object-cover grayscale"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Kararma / kontrast katmanları */}
      <div className="absolute inset-0 -z-10 bg-black/55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />

      {/* İnce kılavuz çizgiler (editöryel his) */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
        <div className="wrap relative h-full">
          <div className="absolute left-6 top-0 h-full w-px bg-white/5 md:left-10" />
          <div className="absolute right-6 top-0 h-full w-px bg-white/5 md:right-10" />
        </div>
      </div>

      {/* İçerik */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="wrap relative flex h-full flex-col justify-end pb-20 pt-24"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-accent" />
          <span className="label text-white/80">{hero.kicker}</span>
        </div>

        <h1 className="h-display mt-6 text-[clamp(3.5rem,8.5vw,6.75rem)] text-white">
          {hero.titleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
          {hero.subtitle}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
            {hero.ctaPrimary}
          </a>
          <a href="#paketler" className="btn btn-outline">
            {hero.ctaSecondary}
          </a>
        </div>
      </motion.div>

      {/* Kaydırma göstergesi */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="label text-white/50">Kaydır</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-accent"
        />
      </div>
    </section>
  );
}
