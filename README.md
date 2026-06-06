# ShopWave — Full-Stack E-commerce Store

A production-grade e-commerce platform built with **React + Redux Toolkit**, **Express**, **Supabase**, and **Stripe**.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router v6 |
| State | Redux Toolkit (authSlice, cartSlice, productsSlice) |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (JWT) |
| Payments | Stripe Checkout + Webhooks |

---

## 🚀 Quick Start

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase.sql`](./supabase.sql)
3. Copy your **Project URL** and **anon key** from Settings → API
4. Copy your **Service Role key** (for the backend)

### 2. Stripe Setup

1. Create an account at [stripe.com](https://stripe.com)
2. Get your **Secret key** from Developers → API keys
3. Install Stripe CLI: https://stripe.com/docs/stripe-cli
4. Run webhooks locally: `stripe listen --forward-to localhost:5000/api/checkout/webhook`
5. Copy the **webhook signing secret** printed by the CLI

### 3. Server Setup

```bash
cd server
cp .env.example .env
# Fill in your values in .env
npm run dev
```

**`server/.env`:**
```env
PORT=5000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...  (service role key)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:5173
```

### 4. Client Setup

```bash
cd client
cp .env.example .env
# Fill in your values in .env
npm run dev
```

**`client/.env`:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...  (anon key)
VITE_API_URL=http://localhost:5000
```

### 5. Set yourself as Admin

After creating your account, go to **Supabase Table Editor → profiles**, find your row, and set `role = 'admin'`.

---

## 📁 Project Structure

```
project-1/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── app/store.js    # Redux store
│       ├── features/       # authSlice, cartSlice, productsSlice
│       ├── pages/          # All pages
│       ├── components/     # Shared components
│       └── lib/            # supabase.js, api.js (axios)
├── server/                 # Express backend
│   ├── middleware/auth.js  # JWT verification
│   ├── routes/             # products, checkout, orders, admin
│   ├── lib/supabase.js     # Supabase service-role client
│   └── index.js            # Entry point
└── supabase.sql            # Database schema + seed data
```

## 🔑 Key Notes

- **Webhook**: Always run `stripe listen --forward-to localhost:5000/api/checkout/webhook` in a separate terminal when testing checkout
- **`unit_price`**: Always snapshotted from Stripe at purchase time — never from the database
- **Admin**: Set `role = 'admin'` manually in the `profiles` table for your account
- **RLS**: All Supabase tables have Row Level Security enabled — users can only see their own data

## 🧭 Build Order

Auth → Products → Cart → Checkout → Orders → Admin
