"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import type { FaqItem } from "@/lib/types";

export function Faq({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-b border-line bg-ink py-24 md:py-32">
      <div className="wrap grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <span className="label">SSS</span>
          </div>
          <h2 className="h-display mt-5 text-5xl text-white md:text-6xl">
            Sıkça <br /> Sorulanlar
          </h2>
        </Reveal>

        <div className="md:col-span-8">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.id} className="border-t border-line last:border-b">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className={`font-display uppercase tracking-[0.06em] text-lg transition-colors md:text-xl ${isOpen ? "text-accent" : "text-white"}`}>
                    {item.question}
                  </span>
                  <span className={`shrink-0 text-2xl leading-none transition-colors ${isOpen ? "text-accent" : "text-muted"}`}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 text-sm leading-relaxed text-white/70">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
