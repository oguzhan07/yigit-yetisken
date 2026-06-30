export type ActionState = { ok: boolean; message: string } | null;

export type PackageType = "online" | "one_on_one" | "program";
export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";
export type MembershipStatus = "active" | "expired" | "cancelled";
export type UserRole = "member" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  email?: string;
}

export interface Package {
  id: string;
  slug: string;
  title: string;
  type: PackageType;
  description: string | null;
  features: string[];
  price_try: number;
  duration_months: number | null;
  is_active: boolean;
  sort_order: number;
}

export interface Membership {
  id: string;
  user_id: string;
  package_id: string | null;
  order_id: string | null;
  start_date: string;
  end_date: string | null;
  status: MembershipStatus;
  packages?: { title: string | null } | null;
}

export interface Order {
  id: string;
  user_id: string | null;
  package_id: string | null;
  package_title: string | null;
  amount_try: number;
  status: OrderStatus;
  created_at: string;
  paid_at: string | null;
}

export interface ProgramItem {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  file_path: string | null;
  created_at: string;
}

export interface ProgressEntry {
  id: string;
  user_id: string;
  entry_date: string;
  weight_kg: number | null;
  measurements: Record<string, unknown>;
  photo_path: string | null;
  note: string | null;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface Onboarding {
  id: string;
  user_id: string;
  goal: string | null;
  birth_date: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  experience_level: string | null;
  training_days_per_week: number | null;
  health_notes: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  result: string | null;
  image_url: string | null;
}

export interface Transformation {
  id: string;
  title: string | null;
  before_url: string | null;
  after_url: string | null;
  caption: string | null;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface LegalPage {
  slug: string;
  title: string;
  content: string | null;
  updated_at: string | null;
}
