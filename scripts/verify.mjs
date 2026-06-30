// Auth + RLS güvenlik modelini gerçek veriyle uçtan uca test eder.
// node --env-file=.env.local scripts/verify.mjs
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.ADMIN_EMAIL || "admin@yigityetisken.com";
const password = process.env.ADMIN_PASSWORD || "YigitAdmin2026!";

const j = (r) => r.json();
const ok = (b) => (b ? "✓" : "✗");

// 1) Şifreyle giriş
const tRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: anon, "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const tok = await j(tRes);
const at = tok.access_token;
console.log(`${ok(!!at)} Giriş (password grant): token alındı = ${!!at}`);

const authHdr = { apikey: anon, Authorization: `Bearer ${at}` };

// 2) Admin profiles okur (RLS: admin hepsini görür)
const ap = await fetch(`${url}/rest/v1/profiles?select=id,role`, { headers: authHdr }).then(j);
console.log(`${ok(Array.isArray(ap) && ap.length >= 1)} Admin profiles okuyabiliyor: ${Array.isArray(ap) ? ap.length + " satır, rol=" + ap[0]?.role : JSON.stringify(ap)}`);

// 3) Anon profiles okuyamaz (RLS engeller → boş)
const anonP = await fetch(`${url}/rest/v1/profiles?select=id`, { headers: { apikey: anon } }).then(j);
console.log(`${ok(Array.isArray(anonP) && anonP.length === 0)} Anon profiles GÖREMİYOR (RLS): ${Array.isArray(anonP) ? anonP.length + " satır" : JSON.stringify(anonP)}`);

// 4) Admin paket ekleyebilir (is_admin write policy)
const ins = await fetch(`${url}/rest/v1/packages`, {
  method: "POST",
  headers: { ...authHdr, "Content-Type": "application/json", Prefer: "return=representation" },
  body: JSON.stringify({ slug: "__test__", title: "TEST", type: "online", price_try: 1 }),
});
const insBody = await j(ins);
console.log(`${ok(ins.ok)} Admin paket ekleyebiliyor: ${ins.ok ? "eklendi" : JSON.stringify(insBody)}`);
if (ins.ok) {
  await fetch(`${url}/rest/v1/packages?slug=eq.__test__`, { method: "DELETE", headers: authHdr });
  console.log("  ↳ temizlik: test paketi silindi");
}

// 5) Anon paket EKLEYEMEZ (RLS engeller)
const anonIns = await fetch(`${url}/rest/v1/packages`, {
  method: "POST",
  headers: { apikey: anon, "Content-Type": "application/json" },
  body: JSON.stringify({ slug: "__test2__", title: "X", type: "online", price_try: 1 }),
});
console.log(`${ok(!anonIns.ok)} Anon paket EKLEYEMİYOR (RLS): HTTP ${anonIns.status}`);

// 6) Herkes aktif paketleri görür
const pub = await fetch(`${url}/rest/v1/packages?select=slug&is_active=eq.true`, { headers: { apikey: anon } }).then(j);
console.log(`${ok(Array.isArray(pub) && pub.length === 4)} Herkes aktif paketleri görüyor: ${Array.isArray(pub) ? pub.length + " paket" : JSON.stringify(pub)}`);
