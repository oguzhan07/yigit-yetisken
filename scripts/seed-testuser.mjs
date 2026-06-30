// Dolu bir test üyesi oluşturur (üyelik + sipariş + onboarding + ilerleme + program + bildirim).
// node --env-file=.env.local scripts/seed-testuser.mjs
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.TEST_EMAIL || "uye@yigityetisken.com";
const password = process.env.TEST_PASSWORD || "TestUye2026!";

const h = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
const rest = (p, opts = {}) =>
  fetch(`${url}/rest/v1/${p}`, { ...opts, headers: { ...h, Prefer: "return=representation", ...(opts.headers || {}) } });
const day = (offset) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);

async function main() {
  // 1) Kullanıcı
  let id;
  const create = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { full_name: "Test Üye" } }),
  });
  const created = await create.json();
  if (create.ok && created.id) {
    id = created.id;
    console.log("Test kullanıcı oluşturuldu:", email);
  } else {
    const list = await (await fetch(`${url}/auth/v1/admin/users?per_page=200`, { headers: h })).json();
    const users = list.users || list;
    id = (Array.isArray(users) ? users.find((u) => u.email === email) : null)?.id;
    if (!id) return console.error("Kullanıcı bulunamadı/oluşmadı:", JSON.stringify(created));
    console.log("Test kullanıcı zaten var:", email);
    // var olan kayıtları temizle (idempotent)
    await rest(`memberships?user_id=eq.${id}`, { method: "DELETE" });
    await rest(`orders?user_id=eq.${id}`, { method: "DELETE" });
    await rest(`programs?user_id=eq.${id}`, { method: "DELETE" });
    await rest(`progress_entries?user_id=eq.${id}`, { method: "DELETE" });
    await rest(`notifications?user_id=eq.${id}`, { method: "DELETE" });
    await rest(`onboarding?user_id=eq.${id}`, { method: "DELETE" });
  }

  // 2) Profil
  await rest(`profiles?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ full_name: "Test Üye", phone: "0500 000 00 00" }) });

  // 3) Paket
  const pkg = (await (await rest(`packages?slug=eq.online-kocluk-3ay&select=id,title,price_try`)).json())[0];

  // 4) Sipariş (ödendi)
  const order = (await (await rest(`orders`, {
    method: "POST",
    body: JSON.stringify({
      user_id: id, package_id: pkg.id, package_title: pkg.title,
      amount_try: pkg.price_try, status: "paid", paid_at: new Date().toISOString(),
    }),
  })).json())[0];

  // 5) Aktif üyelik
  await rest(`memberships`, {
    method: "POST",
    body: JSON.stringify({
      user_id: id, package_id: pkg.id, order_id: order.id,
      start_date: day(0), end_date: day(90), status: "active",
    }),
  });

  // 6) Onboarding
  await rest(`onboarding`, {
    method: "POST",
    body: JSON.stringify({
      user_id: id, goal: "Kas & Form", height_cm: 180, weight_kg: 80,
      experience_level: "Orta", training_days_per_week: 4, health_notes: "Bilinen rahatsızlık yok.",
    }),
  });

  // 7) İlerleme (grafik için)
  await rest(`progress_entries`, {
    method: "POST",
    body: JSON.stringify([
      { user_id: id, entry_date: day(-56), weight_kg: 86, note: "Başlangıç" },
      { user_id: id, entry_date: day(-35), weight_kg: 84 },
      { user_id: id, entry_date: day(-14), weight_kg: 82 },
      { user_id: id, entry_date: day(0), weight_kg: 80.5, note: "İyi gidiyor" },
    ]),
  });

  // 8) Program
  await rest(`programs`, {
    method: "POST",
    body: JSON.stringify({
      user_id: id, uploaded_by: id, title: "Başlangıç Programı · Hafta 1-4",
      description: "Tam vücut, haftada 4 gün. (Dosya örnek olarak boş bırakıldı.)",
    }),
  });

  // 9) Bildirimler
  await rest(`notifications`, {
    method: "POST",
    body: JSON.stringify([
      { user_id: id, title: "Üyeliğin başladı", body: "Online Koçluk · 3 Ay aktif edildi.", type: "membership", is_read: false },
      { user_id: id, title: "Programın yüklendi", body: "İlk antrenman programın panelinde.", type: "program", is_read: false },
      { user_id: id, title: "Hoş geldin", body: "Panelini keşfetmeye başla.", type: "system", is_read: true },
    ]),
  });

  console.log("\nTEST ÜYE HAZIR");
  console.log("E-posta:", email);
  console.log("Şifre  :", password);
  console.log("user_id:", id);
}

main().catch((e) => { console.error(e); process.exit(1); });
