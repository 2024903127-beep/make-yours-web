-- ── MAKE YOUR WEB — SUPABASE DATABASE SETUP ──
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create the 'demos' table
CREATE TABLE IF NOT EXISTS public.demos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT,
    external_url TEXT,
    category TEXT,
    color TEXT DEFAULT '#6c63ff',
    description TEXT,
    status TEXT DEFAULT 'live',
    tags TEXT[],
    builtin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
-- Allow anyone to VIEW live demos (Public Access)
CREATE POLICY "Public view live demos" 
ON public.demos FOR SELECT 
USING (status = 'live');

-- Allow authenticated ADMIN to do everything
-- Note: This assumes you use the 'service_role' key or authenticated sessions
CREATE POLICY "Admin full access" 
ON public.demos FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 4. Initial Seed (Optional: your existing demos)
INSERT INTO public.demos (id, title, slug, category, color, description, status, builtin)
VALUES 
('hotel-1', 'LUMIÈRE Luxury Hotel', 'demos/hotel', 'Hotel & Resort', '#C9A84C', 'Elegant rooms, gold aesthetic, fine dining & rooftop pool showcase.', 'live', true),
('gym-1', 'IRONVAULT Gym', 'demos/gym', 'Gym & Fitness', '#e8ff00', 'Dark neon-yellow hardcore aesthetic. Membership plans & class timetable.', 'live', true),
('restaurant-1', 'EMBER & ASH Restaurant', 'demos/restaurant', 'Restaurant & Café', '#c0622a', 'Warm dark fine-dining theme. Full menu, reservation system & ambiance gallery.', 'live', true),
('clinic-1', 'SERENOVA Health', 'demos/clinic', 'Clinic & Hospital', '#0891b2', 'Clean teal-white medical design. Doctor profiles & appointment booking.', 'live', true),
('education-1', 'MERIDIAN Institute', 'demos/education', 'Education', '#2563eb', 'Light editorial education design. Course listings & online admission form.', 'live', true),
('real-estate-1', 'AURUM Estates', 'demos/real-estate', 'Real Estate', '#c9a84c', 'Dark gold luxury real estate. Property listings, virtual tours & lead capture.', 'live', true),
('business-1', 'PRESTIGE — Universal Business', 'demos/business', 'Small Business', '#4f7cff', 'One template, 6 live switchable colour themes. Works for any business.', 'live', true)
ON CONFLICT (id) DO NOTHING;
