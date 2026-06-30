// Bir admin hesabı oluşturur ve profiles.role = 'admin' yapar.
// Kullanım: node --env-file=.env.local scripts/seed-admin.mjs
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL || "admin@yigityetisken.com";
const password = process.env.ADMIN_PASSWORD || "YigitAdmin2026!";

if (!url || !key) {
  console.error("HATA: SUPABASE env değerleri eksik.");
  process.exit(1);
}

const h = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

async function main() {
  // 1) Kullanıcıyı oluştur
  let id = null;
  const create = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Yiğit Yetişken" },
    }),
  });
  const created = await create.json();

  if (create.ok && created.id) {
    id = created.id;
    console.log("Kullanıcı oluşturuldu:", email);
  } else {
    // Zaten varsa: listeden bul
    const list = await fetch(`${url}/auth/v1/admin/users?per_page=200`, { headers: h });
    const data = await list.json();
    const users = data.users || data;
    const found = Array.isArray(users) ? users.find((u) => u.email === email) : null;
    if (found) {
      id = found.id;
      console.log("Kullanıcı zaten var, kullanılıyor:", email);
    } else {
      console.error("Kullanıcı oluşturulamadı:", JSON.stringify(created));
      process.exit(1);
    }
  }

  // 2) Rolü admin yap
  const patch = await fetch(`${url}/rest/v1/profiles?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...h, Prefer: "return=representation" },
    body: JSON.stringify({ role: "admin", full_name: "Yiğit Yetişken" }),
  });
  const patched = await patch.json();

  if (patch.ok && Array.isArray(patched) && patched.length) {
    console.log("Rol güncellendi -> admin. Profil:", JSON.stringify(patched[0]));
  } else {
    console.error("Profil güncellenemedi:", JSON.stringify(patched));
    process.exit(1);
  }

  console.log("\nADMIN HAZIR");
  console.log("E-posta:", email);
  console.log("user_id:", id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
