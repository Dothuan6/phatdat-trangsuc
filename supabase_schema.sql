-- ============================================================
-- PHÁT ĐẠT JEWELRY — SUPABASE DATABASE SCHEMA
-- Project ID: mvmxlcruorsjejnjugrf
-- Run this script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mvmxlcruorsjejnjugrf/sql/new
-- ============================================================

-- 1. Create table: products
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    reference TEXT NOT NULL,
    collection TEXT,
    category TEXT NOT NULL,
    materials TEXT,
    stones TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    currency TEXT DEFAULT '₫',
    images JSONB DEFAULT '[]'::jsonb,
    available_sizes JSONB DEFAULT '[]'::jsonb,
    available_colors JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 20,
    description TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create table: collections
CREATE TABLE IF NOT EXISTS public.collections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    color TEXT DEFAULT '#1B2A4A',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create table: contacts (Customer inquiries)
CREATE TABLE IF NOT EXISTS public.contacts (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending', -- pending, contacted, completed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create table: site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ══════════════════════════════════════════════════════════════

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products, collections, site_settings
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);

-- Allow public insert into contacts (for customers leaving messages)
CREATE POLICY "Public insert contacts" ON public.contacts FOR INSERT WITH CHECK (true);

-- Allow all operations for authenticated or anon with full client access
CREATE POLICY "Allow all on products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on collections" ON public.collections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on contacts" ON public.contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════
-- SEED INITIAL DATA (BỘ SƯU TẬP & SẢN PHẨM PHÁT ĐẠT JEWELRY)
-- ══════════════════════════════════════════════════════════════

-- Seed Collections
INSERT INTO public.collections (id, name, description, image, color) VALUES
('co-ba-la', 'Cỏ Ba Lá', 'Biểu tượng của may mắn và hạnh phúc, họa tiết cỏ ba lá xà cừ thanh lịch cho mọi dịp.', './images/gallery/g16.jpg', '#1B2A4A'),
('hoa-xinh', 'Hoa Xinh', 'Những bông hoa nhỏ nhắn đính đá CZ, nhẹ nhàng và nữ tính như chính bạn.', './images/gallery/g11.jpg', '#A8B09A'),
('hat-ngoc', 'Hạt Ngọc', 'Những hạt tròn bóng gương xếp liền mạch, tối giản mà sang trọng.', './images/gallery/g22.jpg', '#7EAED4'),
('ngot-ngao', 'Ngọt Ngào', 'Trái tim và họa tiết nhỏ xinh — món quà ngọt ngào dành tặng người thương.', './images/gallery/g19.jpg', '#C4A77D'),
('canh-buom', 'Cánh Bướm', 'Đôi bướm tung bay với ngọc lam và đá CZ, biểu tượng của tự do.', './images/gallery/g18.jpg', '#D8C4D8'),
('anh-sao', 'Ánh Sao', 'Moissanite và đá CZ rực rỡ như ánh sao, toả sáng trong mọi khoảnh khắc.', './images/gallery/g1.jpg', '#2D5A3D')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Seed Products Sample
INSERT INTO public.products (id, name, reference, collection, category, materials, stones, price, images, available_sizes, available_colors, description, specifications) VALUES
('day-chuyen-co-ba-la', 'Dây chuyền cỏ ba lá', 'PDDAYCHUY', 'Cỏ Ba Lá', 'necklaces', 'Bạc 925 xi vàng', 'Xà cừ', 289000, 
 '["./images/products/daychuyen3-removebg-preview.png", "./images/gallery/g15.jpg", "./images/gallery/g16.jpg"]'::jsonb,
 '["Dây 40cm (Chuẩn ôm cổ)", "Dây 45cm (Thả nhẹ vừa vặn)"]'::jsonb,
 '["Bạc sáng 925 nguyên bản", "Xi mạ vàng 18K cao cấp", "Xi mạ vàng hồng"]'::jsonb,
 'Mặt cỏ ba lá xà cừ biểu tượng của may mắn, phù hợp đeo hằng ngày hoặc làm quà tặng.',
 '{"Chất liệu": "Bạc 925 xi vàng", "Đá đính kèm": "Xà cừ", "Kích thước mặt": "Khoảng 15 mm", "Độ dài dây": "Khoảng 42 cm"}'::jsonb),

('nhan-co-ba-la', 'Nhẫn cỏ ba lá', 'PDNHANCOB', 'Cỏ Ba Lá', 'rings', 'Bạc 925 xi vàng', 'Đá CZ, Xà cừ', 249000,
 '["./images/products/4-removebg-preview.png", "./images/gallery/g1.jpg", "./images/gallery/g2.jpg"]'::jsonb,
 '["Freesize (Tự chỉnh)", "Size 6 (16mm)", "Size 7 (17mm)", "Size 8 (18mm)"]'::jsonb,
 '["Bạc sáng 925 nguyên bản", "Xi mạ vàng 18K cao cấp"]'::jsonb,
 'Nhẫn cỏ ba lá tinh tế với viên đá CZ lấp lánh ở trung tâm.',
 '{"Chất liệu": "Bạc 925 xi vàng", "Đá đính kèm": "Đá CZ, Xà cừ", "Size": "Điều chỉnh được"}'::jsonb),

('lac-tay-co-ba-la-5', 'Lắc tay cỏ ba lá 5 họa tiết', 'PDLACTAYC', 'Cỏ Ba Lá', 'bracelets', 'Bạc 925 xi vàng', 'Xà cừ', 359000,
 '["./images/products/4-removebg-preview.png", "./images/gallery/g20.jpg", "./images/gallery/g21.jpg"]'::jsonb,
 '["16cm (Cổ tay nhỏ)", "17.5cm (Cổ tay vừa)", "Freesize kèm xích phụ"]'::jsonb,
 '["Bạc sáng 925 nguyên bản", "Xi mạ vàng 18K cao cấp"]'::jsonb,
 'Năm họa tiết cỏ ba lá điểm xuyết trên chiếc lắc tay mảnh mai, nữ tính.',
 '{"Chất liệu": "Bạc 925 xi vàng", "Số họa tiết": "5", "Độ dài": "16–19 cm"}'::jsonb),

('nhan-kim-cuong-nhan-tao', 'Nhẫn đá Moissanite ổ hoa', 'PDNHANKIM', 'Ánh Sao', 'rings', 'Bạc 925 xi bạch kim', 'Moissanite', 399000,
 '["./images/gallery/g1.jpg", "./images/gallery/g7.jpg", "./images/gallery/g8.jpg"]'::jsonb,
 '["Freesize (Tự chỉnh)", "Size 6 (16mm)", "Size 7 (17mm)", "Size 8 (18mm)"]'::jsonb,
 '["Xi bạch kim cao cấp", "Bạc sáng 925 nguyên bản"]'::jsonb,
 'Viên Moissanite lớn được bao quanh bởi vòng đá nhỏ, rực rỡ như ánh sao.',
 '{"Chất liệu": "Bạc 925 xi bạch kim", "Đá": "Moissanite", "Size": "Điều chỉnh được"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
