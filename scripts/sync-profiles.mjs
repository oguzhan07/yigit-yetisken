// Eksik profilleri tamamlar ve verilen e-postaları admin yapar.
// node --env-file=.env.local scripts/sync-profiles.mjs
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const h = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

const ADMINS = ["oguzhan@gmail.com", "oguzhanakin365@gmail.com"];

const au = await (await fetch(`${url}/auth/v1/admin/users?per_page=100`, { headers: h })).json();
const users = au.users || au;
const profs = await (await fetch(`${url}/rest/v1/profiles?select=id`, { headers: h })).json();
const have = new Set((profs || []).map((p) => p.id));

// 1) Eksik profilleri ekle
for (const u of users.filter((x) => !have.has(x.id))) {
  await fetch(`${url}/rest/v1/profiles`, {
    method: "POST",
    headers: { ...h, Prefer: "resolution=ignore-duplicates" },
    body: JSON.stringify({ id: u.id, full_name: u.user_metadata?.full_name || "", role: "member" }),
  });
  console.log("Profil eklendi:", u.email);
}

// 2) Hedef e-postaları admin yap
for (const email of ADMINS) {
  const u = users.find((x) => x.email === email);
  if (!u) { console.log("Bulunamadı:", email); continue; }
  await fetch(`${url}/rest/v1/profiles?id=eq.${u.id}`, {
    method: "PATCH",
    headers: h,
    body: JSON.stringify({ role: "admin" }),
  });
  console.log("Admin yapıldı:", email);
}

// 3) Son durum
const final = await (await fetch(`${url}/rest/v1/profiles?select=id,role,full_name`, { headers: h })).json();
const byId = Object.fromEntries(final.map((p) => [p.id, p]));
console.log("\nGüncel roller:");
for (const u of users) console.log(`  ${u.email} -> ${byId[u.id]?.role ?? "(yok)"}`);
