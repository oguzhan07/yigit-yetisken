"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startCheckout } from "@/app/uyelik/checkout";

export function BuyButton({
  packageId,
  label = "Satın Al",
}: {
  packageId: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function buy() {
    setErr(null);
    setLoading(true);
    try {
      const res = await startCheckout(packageId);
      if (res.error === "login") {
        router.push("/giris?next=/uyelik");
        return;
      }
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      setErr(res.error || "Bir hata oluştu.");
    } catch {
      setErr("Bir hata oluştu.");
    }
    setLoading(false);
  }

  return (
    <div className="mt-6">
      <button
        onClick={buy}
        disabled={loading}
        className="btn btn-accent w-full !py-3 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Yönlendiriliyor..." : label}
      </button>
      {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
    </div>
  );
}
