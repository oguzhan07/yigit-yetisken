"use client";

import { createClient } from "@/lib/supabase/client";

export function GoogleButton({
  next,
  disabled,
}: {
  next: string;
  disabled?: boolean;
}) {
  async function go() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  return (
    <button
      type="button"
      onClick={go}
      disabled={disabled}
      className="btn btn-outline w-full disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12 11v2.85h4.05c-.18 1.05-1.35 3.1-4.05 3.1a4.95 4.95 0 1 1 0-9.9c1.42 0 2.37.6 2.92 1.12l1.99-1.92A7.55 7.55 0 0 0 12 4a8 8 0 1 0 0 16c4.62 0 7.68-3.25 7.68-7.82 0-.53-.06-.93-.13-1.33H12z" />
      </svg>
      Google ile devam et
    </button>
  );
}
