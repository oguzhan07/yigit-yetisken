"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/content";

const goals = ["Yağ Yakımı", "Kas & Form", "Performans", "Genel Sağlık", "Kararsızım"];
const models = ["Online Koçluk", "Birebir Antrenman", "Program Paketi", "Kararsızım"];

export function MembershipForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg =
      `Yeni Başvuru\n` +
      `————————————\n` +
      `Ad Soyad: ${f.get("name") || "-"}\n` +
      `Telefon: ${f.get("phone") || "-"}\n` +
      `E-posta: ${f.get("email") || "-"}\n` +
      `Hedef: ${f.get("goal") || "-"}\n` +
      `Model: ${f.get("model") || "-"}\n` +
      `Mesaj: ${f.get("message") || "-"}`;
    window.open(whatsappUrl(msg), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const fieldCls =
    "w-full border border-line bg-ink px-4 py-3 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none transition-colors";
  const labelCls = "label mb-2 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="name">Ad Soyad</label>
          <input id="name" name="name" required className={fieldCls} placeholder="Adın ve soyadın" />
        </div>
        <div>
          <label className={labelCls} htmlFor="phone">Telefon</label>
          <input id="phone" name="phone" required className={fieldCls} placeholder="05xx xxx xx xx" />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="email">E-posta <span className="text-muted">(opsiyonel)</span></label>
        <input id="email" name="email" type="email" className={fieldCls} placeholder="ornek@eposta.com" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="goal">Hedefin</label>
          <select id="goal" name="goal" className={fieldCls} defaultValue="">
            <option value="" disabled>Seç</option>
            {goals.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="model">Tercih Edilen Model</label>
          <select id="model" name="model" className={fieldCls} defaultValue="">
            <option value="" disabled>Seç</option>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="message">Mesaj</label>
        <textarea id="message" name="message" rows={4} className={fieldCls} placeholder="Kısaca durumunu ve beklentini yaz..." />
      </div>

      <button type="submit" className="btn btn-accent w-full sm:w-auto">
        Başvuruyu Gönder
      </button>

      {sent && (
        <p className="text-sm text-accent">
          WhatsApp penceresi açıldı — başvurunu göndermek için mesajı ilet. Açılmadıysa
          sağ alttaki WhatsApp butonunu kullanabilirsin.
        </p>
      )}
      <p className="text-xs text-muted">
        Not: Başvurular şimdilik WhatsApp üzerinden iletilir. Online ödeme ve üye
        girişi bir sonraki aşamada eklenecektir.
      </p>
    </form>
  );
}
