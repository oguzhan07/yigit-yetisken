const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const h = { apikey: key, Authorization: `Bearer ${key}` };

const au = await (await fetch(`${url}/auth/v1/admin/users?per_page=100`, { headers: h })).json();
const users = au.users || au;
const profs = await (await fetch(`${url}/rest/v1/profiles?select=id,role,full_name`, { headers: h })).json();
const byId = Object.fromEntries((profs || []).map((p) => [p.id, p]));

console.log("Kayıtlı hesaplar:");
for (const u of users) {
  const p = byId[u.id];
  console.log(`  ${u.email}  ->  rol: ${p?.role ?? "(profil yok)"}  | ad: ${p?.full_name ?? "-"}`);
}
