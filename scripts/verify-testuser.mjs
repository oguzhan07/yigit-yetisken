const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.TEST_EMAIL || "uye@yigityetisken.com";
const password = process.env.TEST_PASSWORD || "TestUye2026!";

const t = await (await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: anon, "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
})).json();
const at = t.access_token;
const H = { apikey: anon, Authorization: `Bearer ${at}` };
const q = async (p) => await (await fetch(`${url}/rest/v1/${p}`, { headers: H })).json();

console.log("Giriş:", !!at ? "✓" : "✗");
const m = await q("memberships?select=status,end_date,packages(title)");
console.log("Üyelik:", JSON.stringify(m));
const o = await q("orders?select=status,amount_try");
const pr = await q("progress_entries?select=weight_kg&order=entry_date");
const n = await q("notifications?select=is_read");
const ob = await q("onboarding?select=goal,weight_kg");
console.log("Siparişler:", o.length, "| İlerleme kayıtları:", pr.length, "| Bildirimler:", n.length, "(okunmamış:", n.filter((x) => !x.is_read).length + ")");
console.log("Onboarding hedefi:", ob[0]?.goal, "| Kilolar:", pr.map((x) => x.weight_kg).join(" → "));
