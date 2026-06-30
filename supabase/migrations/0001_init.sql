-- ============================================================
--  Yiğit Yetişken — Faz 2 veritabanı şeması
--  Supabase SQL Editor'da bu dosyayı çalıştır.
-- ============================================================

-- ---------- ENUM tipleri (yeniden-çalıştırılabilir) ----------
do $$ begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('member', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'package_type') then
    create type package_type as enum ('online', 'one_on_one', 'program');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('pending', 'paid', 'failed', 'cancelled', 'refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'membership_status') then
    create type membership_status as enum ('active', 'expired', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'notification_type') then
    create type notification_type as enum ('system', 'program', 'membership', 'payment');
  end if;
end $$;

-- ---------- Yardımcı fonksiyonlar ----------
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- (is_admin() profiles tablosundan SONRA tanımlanır — aşağıya bak)

-- ============================================================
--  TABLOLAR
-- ============================================================

-- ---------- profiles (auth.users uzantısı) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text default '',
  phone text,
  avatar_url text,
  role user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Yeni kullanıcı kaydında profil oluştur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- RLS içinde güvenli admin kontrolü (profiles'tan sonra; RLS'i atlar, recursion önler)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- packages (admin düzenlenebilir) ----------
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  type package_type not null default 'online',
  description text,
  features text[] not null default '{}',
  price_try numeric(10,2) not null default 0,
  duration_months int,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger packages_updated_at before update on public.packages
  for each row execute function public.handle_updated_at();

-- ---------- orders ----------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  package_id uuid references public.packages(id) on delete set null,
  package_title text,
  amount_try numeric(10,2) not null,
  status order_status not null default 'pending',
  iyzico_payment_id text,
  iyzico_conversation_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index orders_user_idx on public.orders(user_id);

-- ---------- memberships ----------
create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  package_id uuid references public.packages(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  start_date date not null default current_date,
  end_date date,
  status membership_status not null default 'active',
  created_at timestamptz not null default now()
);
create index memberships_user_idx on public.memberships(user_id);

-- ---------- onboarding (üye başına 1) ----------
create table public.onboarding (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.profiles(id) on delete cascade,
  goal text,
  birth_date date,
  height_cm int,
  weight_kg numeric(5,2),
  experience_level text,
  training_days_per_week int,
  health_notes text,
  extra jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger onboarding_updated_at before update on public.onboarding
  for each row execute function public.handle_updated_at();

-- ---------- programs (koç yükler) ----------
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  file_path text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index programs_user_idx on public.programs(user_id);

-- ---------- progress_entries (ilerleme takibi) ----------
create table public.progress_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_date date not null default current_date,
  weight_kg numeric(5,2),
  measurements jsonb not null default '{}',
  photo_path text,
  note text,
  created_at timestamptz not null default now()
);
create index progress_user_idx on public.progress_entries(user_id);

-- ---------- notifications ----------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  type notification_type not null default 'system',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications(user_id);

-- ---------- testimonials (admin düzenlenebilir) ----------
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quote text not null,
  result text,
  image_path text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.handle_updated_at();

-- ---------- transformations (admin düzenlenebilir) ----------
create table public.transformations (
  id uuid primary key default gen_random_uuid(),
  title text,
  before_path text,
  after_path text,
  caption text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger transformations_updated_at before update on public.transformations
  for each row execute function public.handle_updated_at();

-- ---------- faqs (admin düzenlenebilir) ----------
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger faqs_updated_at before update on public.faqs
  for each row execute function public.handle_updated_at();

-- ---------- legal_pages (admin düzenlenebilir) ----------
create table public.legal_pages (
  slug text primary key,
  title text not null,
  content text,
  updated_at timestamptz not null default now()
);
create trigger legal_pages_updated_at before update on public.legal_pages
  for each row execute function public.handle_updated_at();

-- ---------- page_views (analitik) ----------
create table public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  referrer text,
  session_id text,
  country text,
  device text,
  created_at timestamptz not null default now()
);
create index page_views_created_idx on public.page_views(created_at);

-- ============================================================
--  RLS (Row Level Security)
-- ============================================================
alter table public.profiles         enable row level security;
alter table public.packages         enable row level security;
alter table public.orders           enable row level security;
alter table public.memberships      enable row level security;
alter table public.onboarding       enable row level security;
alter table public.programs         enable row level security;
alter table public.progress_entries enable row level security;
alter table public.notifications    enable row level security;
alter table public.testimonials     enable row level security;
alter table public.transformations  enable row level security;
alter table public.faqs             enable row level security;
alter table public.legal_pages      enable row level security;
alter table public.page_views       enable row level security;

-- profiles
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- packages: herkes aktif olanları görür; admin her şeyi yönetir
create policy "packages_public_read" on public.packages
  for select using (is_active or public.is_admin());
create policy "packages_admin_write" on public.packages
  for all using (public.is_admin()) with check (public.is_admin());

-- orders
create policy "orders_select_own_or_admin" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());
create policy "orders_insert_own" on public.orders
  for insert with check (user_id = auth.uid());
create policy "orders_admin_write" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

-- memberships
create policy "memberships_select_own_or_admin" on public.memberships
  for select using (user_id = auth.uid() or public.is_admin());
create policy "memberships_admin_write" on public.memberships
  for all using (public.is_admin()) with check (public.is_admin());

-- onboarding (üye kendi kaydını yönetir)
create policy "onboarding_rw_own" on public.onboarding
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- programs (üye kendi programını görür; admin yönetir)
create policy "programs_select_own_or_admin" on public.programs
  for select using (user_id = auth.uid() or public.is_admin());
create policy "programs_admin_write" on public.programs
  for all using (public.is_admin()) with check (public.is_admin());

-- progress_entries (üye tamamen kendi)
create policy "progress_rw_own" on public.progress_entries
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- notifications (üye kendi okur/günceller; admin oluşturur)
create policy "notifications_select_own_or_admin" on public.notifications
  for select using (user_id = auth.uid() or public.is_admin());
create policy "notifications_update_own" on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifications_admin_write" on public.notifications
  for all using (public.is_admin()) with check (public.is_admin());

-- yayınlanmış içerik herkese açık; admin yönetir
create policy "testimonials_public_read" on public.testimonials
  for select using (is_published or public.is_admin());
create policy "testimonials_admin_write" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

create policy "transformations_public_read" on public.transformations
  for select using (is_published or public.is_admin());
create policy "transformations_admin_write" on public.transformations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "faqs_public_read" on public.faqs
  for select using (is_published or public.is_admin());
create policy "faqs_admin_write" on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "legal_public_read" on public.legal_pages
  for select using (true);
create policy "legal_admin_write" on public.legal_pages
  for all using (public.is_admin()) with check (public.is_admin());

-- page_views: herkes ekleyebilir (anon dahil), sadece admin okur
create policy "page_views_insert_any" on public.page_views
  for insert to anon, authenticated with check (true);
create policy "page_views_admin_read" on public.page_views
  for select using (public.is_admin());

-- ============================================================
--  STORAGE kovaları + politikaları
-- ============================================================
insert into storage.buckets (id, name, public) values
  ('transformations', 'transformations', true),
  ('testimonials', 'testimonials', true),
  ('avatars', 'avatars', true),
  ('programs', 'programs', false),
  ('progress', 'progress', false)
on conflict (id) do nothing;

-- Açık kovalar: herkes okur, admin yazar
create policy "public_buckets_read" on storage.objects
  for select using (bucket_id in ('transformations','testimonials','avatars'));
create policy "public_buckets_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('transformations','testimonials','avatars') and public.is_admin());
create policy "public_buckets_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id in ('transformations','testimonials','avatars') and public.is_admin());

-- programs: admin yazar; üye kendi klasörünü okur ( programs/{user_id}/... )
create policy "programs_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'programs' and public.is_admin());
create policy "programs_read_own_or_admin" on storage.objects
  for select to authenticated
  using (bucket_id = 'programs' and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text));

-- progress: üye kendi klasörünü yönetir ( progress/{user_id}/... )
create policy "progress_rw_own" on storage.objects
  for all to authenticated
  using (bucket_id = 'progress' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'progress' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
--  BAŞLANGIÇ VERİSİ (örnek paketler — fiyatlar placeholder, admin'den düzenlenir)
-- ============================================================
insert into public.packages (slug, title, type, description, features, price_try, duration_months, sort_order) values
  ('online-kocluk-3ay', 'Online Koçluk · 3 Ay', 'online',
   'Uzaktan, kişiye özel antrenman ve beslenme takibi; düzenli kontrol.',
   array['Kişiye özel antrenman programı','Beslenme yönlendirmesi','İki haftada bir kontrol','WhatsApp destek'],
   2999.00, 3, 1),
  ('online-kocluk-6ay', 'Online Koçluk · 6 Ay', 'online',
   'Uzun vadeli dönüşüm için 6 aylık kapsamlı online koçluk.',
   array['Kişiye özel antrenman programı','Detaylı beslenme planı','Haftalık kontrol','Öncelikli WhatsApp destek'],
   4999.00, 6, 2),
  ('birebir-antrenman', 'Birebir Antrenman', 'one_on_one',
   'Yüz yüze, birebir seans bazlı çalışma; teknik ve form üzerine yoğunlaşma.',
   array['Birebir seans','Teknik & form düzeltme','Esnek randevu'],
   750.00, null, 3),
  ('program-paketi', 'Program Paketi', 'program',
   'Belirli süreli, tek seferlik ve hedef odaklı hazır program.',
   array['Hazır antrenman programı','Hedefe göre kurgu','PDF teslim'],
   999.00, null, 4)
on conflict (slug) do nothing;

-- Yasal sayfa iskeletleri
insert into public.legal_pages (slug, title, content) values
  ('mesafeli-satis', 'Mesafeli Satış Sözleşmesi', '[TASLAK] Bu metin hukuki inceleme sonrası doldurulacaktır.'),
  ('kvkk', 'KVKK Aydınlatma Metni', '[TASLAK] Bu metin hukuki inceleme sonrası doldurulacaktır.'),
  ('iptal-iade', 'İptal ve İade Koşulları', '[TASLAK] Bu metin hukuki inceleme sonrası doldurulacaktır.')
on conflict (slug) do nothing;
