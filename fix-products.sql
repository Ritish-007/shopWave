-- Quick fix: Delete old products and re-seed with correct images
-- Run ONLY this file in Supabase SQL Editor

delete from public.order_items;
delete from public.orders;
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
('Minimal Desk Lamp', 'Adjustable LED desk lamp with touch dimmer, warm-to-cool color temperature, and USB charging port.', 64.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=600&fit=crop', 'Lifestyle', 35),
('Premium Cotton Tee', 'Heavyweight 220gsm organic cotton with a relaxed fit. Garment-dyed for a lived-in feel.', 38.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', 'Clothing', 200);
