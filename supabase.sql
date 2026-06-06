-- ============================================================
-- ShopWave E-commerce — Supabase SQL Schema
-- Run this in Supabase SQL Editor: Dashboard > SQL Editor
-- ============================================================

-- ── 1. Profiles table ────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  role text not null default 'customer',
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

-- Users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Service role (server) can do everything
create policy "Service role full access on profiles"
  on public.profiles for all using (auth.role() = 'service_role');

-- ── 2. Auto-create profile on signup ─────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 3. Products table ─────────────────────────────────────────
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  category text,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz default now() not null
);

alter table public.products enable row level security;

-- Anyone can read products
create policy "Products are publicly readable"
  on public.products for select using (true);

-- Only service role can write (via backend)
create policy "Service role full access on products"
  on public.products for all using (auth.role() = 'service_role');

-- ── 4. Orders table ──────────────────────────────────────────
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending',
  total numeric(10,2) not null default 0,
  created_at timestamptz default now() not null
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Service role full access on orders"
  on public.orders for all using (auth.role() = 'service_role');

-- ── 5. Order Items table ──────────────────────────────────────
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  created_at timestamptz default now() not null
);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Service role full access on order_items"
  on public.order_items for all using (auth.role() = 'service_role');

-- ── 6. Stock decrement function (RPC) ────────────────────────
create or replace function public.decrement_stock(p_product_id uuid, p_quantity integer)
returns void language plpgsql security definer as $$
begin
  update public.products
  set stock = greatest(0, stock - p_quantity)
  where id = p_product_id;
end;
$$;

-- ── 7. Seed sample products ───────────────────────────────────
-- Delete old products so we can re-seed with correct images
delete from public.products;

insert into public.products (name, description, price, image_url, category, stock) values
('Wireless Noise-Cancelling Headphones', 'Premium over-ear headphones with 30-hour battery life and adaptive active noise cancellation for immersive listening.', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', 'Electronics', 25),
('Mechanical Keyboard Pro', 'Cherry MX switches, per-key RGB, aircraft-grade aluminum frame. Built for those who type with purpose.', 149.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop', 'Electronics', 40),
('Classic Leather Wallet', 'Slim RFID-blocking bifold crafted from full-grain Italian leather. Ages beautifully with use.', 49.99, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop', 'Accessories', 100),
('Running Shoes Ultra', 'Engineered mesh upper with responsive foam midsole and carbon-fiber energy plate for race day.', 189.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', 'Footwear', 60),
('Insulated Water Bottle', 'Double-wall vacuum insulated 32oz stainless steel. Keeps cold 24h, hot 12h. Leak-proof lid.', 34.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop', 'Lifestyle', 150),
('Wool Blend Overcoat', 'Tailored fit with horn buttons and luxurious merino-cashmere blend. A timeless wardrobe staple.', 349.00, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=600&fit=crop', 'Clothing', 30),
('Smart Fitness Watch', 'Heart rate, SpO2, GPS, and sleep tracking packed into a minimal design with 7-day battery.', 79.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', 'Electronics', 80),
('Ceramic Pour-Over Set', 'Handmade ceramic dripper paired with borosilicate glass carafe and natural bamboo stand.', 59.99, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop', 'Lifestyle', 45),
('Canvas Backpack', 'Waxed canvas with leather trim, padded laptop compartment, and waterproof lining. Built to last.', 129.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 'Accessories', 55),
('Polarized Sunglasses', 'Acetate frame with polarized CR-39 lenses. UV400 protection meets timeless style.', 89.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop', 'Accessories', 70),
('Minimal Desk Lamp', 'Adjustable LED desk lamp with touch dimmer, warm-to-cool color temperature, and USB charging port.', 64.99, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop', 'Lifestyle', 35),
('Premium Cotton Tee', 'Heavyweight 220gsm organic cotton with a relaxed fit. Garment-dyed for a lived-in feel.', 38.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', 'Clothing', 200);
