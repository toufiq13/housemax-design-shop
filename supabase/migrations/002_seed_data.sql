-- Insert categories
INSERT INTO public.categories (id, name, description, image_url) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Furniture', 'Complete furniture collection for every room', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Lighting', 'Modern and traditional lighting solutions', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Flooring & Rugs', 'Beautiful flooring and area rugs', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Window Treatments', 'Curtains, blinds, and window accessories', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Textiles & Soft Furnishings', 'Pillows, throws, and soft decor', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
    ('550e8400-e29b-41d4-a716-446655440006', 'Storage & Organization', 'Storage solutions and organization systems', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
    ('550e8400-e29b-41d4-a716-446655440007', 'Kitchen & Dining Accessories', 'Kitchen and dining room accessories', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
    ('550e8400-e29b-41d4-a716-446655440008', 'Bathroom Accessories', 'Bathroom fixtures and accessories', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
    ('550e8400-e29b-41d4-a716-446655440009', 'Décor & Accessories', 'Decorative items and home accessories', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
    ('550e8400-e29b-41d4-a716-446655440010', 'Technology & Smart Devices', 'Smart home technology and devices', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'),
    ('550e8400-e29b-41d4-a716-446655440011', 'Outdoor/Patio Interior', 'Outdoor furniture and patio accessories', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop');

-- Insert subcategories
INSERT INTO public.subcategories (id, category_id, name, description) VALUES
    -- Furniture subcategories
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Sofas & Couches', 'Comfortable seating for living rooms'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Dining Tables & Chairs', 'Dining room furniture sets'),
    ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Beds', 'Bedroom furniture and bed frames'),
    ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Storage Furniture', 'Cabinets, dressers, and storage solutions'),
    ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Office Furniture', 'Desks, chairs, and office accessories'),
    
    -- Lighting subcategories
    ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Ceiling Lights', 'Chandeliers, pendant lights, and ceiling fixtures'),
    ('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Table Lamps', 'Desk and table lighting solutions'),
    ('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Floor Lamps', 'Standing and floor lighting fixtures'),
    ('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 'Wall Sconces', 'Wall-mounted lighting fixtures'),
    
    -- Flooring & Rugs subcategories
    ('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 'Area Rugs', 'Decorative area rugs and carpets'),
    ('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Runners', 'Hallway and stair runners'),
    ('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'Doormats', 'Entryway and outdoor mats');

-- Insert sample products
INSERT INTO public.products (id, name, description, price, category_id, subcategory_id, image_url, tags, popularity, rating, trending, stock_quantity) VALUES
    -- Furniture products
    ('770e8400-e29b-41d4-a716-446655440001', 'Modern Sectional Sofa', 'Comfortable and stylish sectional sofa perfect for modern living spaces', 1299.00, '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop', ARRAY['modern', 'comfortable', 'sectional', 'gray'], 0.9, 4.8, true, 15),
    ('770e8400-e29b-41d4-a716-446655440002', 'Luxury Chesterfield Sofa', 'Classic Chesterfield design with premium leather upholstery', 1899.00, '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', ARRAY['luxury', 'leather', 'classic', 'brown'], 0.8, 4.7, true, 8),
    ('770e8400-e29b-41d4-a716-446655440003', 'Farmhouse Dining Table', 'Rustic farmhouse dining table seating 8 people', 1299.00, '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop', ARRAY['farmhouse', 'rustic', 'wood', 'large'], 0.7, 4.5, false, 12),
    ('770e8400-e29b-41d4-a716-446655440004', 'Modern Dining Chair Set', 'Set of 4 modern dining chairs with upholstered seats', 599.00, '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop', ARRAY['modern', 'upholstered', 'set', 'comfortable'], 0.6, 4.3, false, 20),
    ('770e8400-e29b-41d4-a716-446655440005', 'King Size Platform Bed', 'Modern platform bed with built-in storage drawers', 1199.00, '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop', ARRAY['modern', 'platform', 'storage', 'king'], 0.8, 4.6, true, 10),
    
    -- Lighting products
    ('770e8400-e29b-41d4-a716-446655440006', 'Crystal Chandelier', 'Elegant crystal chandelier for dining rooms and foyers', 899.00, '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', ARRAY['crystal', 'chandelier', 'elegant', 'dining'], 0.7, 4.4, false, 5),
    ('770e8400-e29b-41d4-a716-446655440007', 'Modern Table Lamp', 'Sleek modern table lamp with adjustable brightness', 199.00, '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', ARRAY['modern', 'adjustable', 'sleek', 'table'], 0.6, 4.2, false, 25),
    ('770e8400-e29b-41d4-a716-446655440008', 'Industrial Floor Lamp', 'Vintage industrial style floor lamp with Edison bulbs', 299.00, '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', ARRAY['industrial', 'vintage', 'edison', 'floor'], 0.5, 4.1, false, 18),
    
    -- Flooring & Rugs products
    ('770e8400-e29b-41d4-a716-446655440009', 'Persian Area Rug', 'Hand-woven Persian rug with traditional patterns', 799.00, '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440010', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', ARRAY['persian', 'hand-woven', 'traditional', 'pattern'], 0.8, 4.7, true, 7),
    ('770e8400-e29b-41d4-a716-446655440010', 'Modern Geometric Rug', 'Contemporary geometric pattern area rug', 399.00, '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440010', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', ARRAY['modern', 'geometric', 'contemporary', 'pattern'], 0.6, 4.3, false, 15),
    
    -- Décor & Accessories products
    ('770e8400-e29b-41d4-a716-446655440011', 'Abstract Wall Art', 'Large abstract painting for modern interiors', 299.00, '550e8400-e29b-41d4-a716-446655440009', null, 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop', ARRAY['abstract', 'wall-art', 'modern', 'painting'], 0.5, 4.0, false, 12),
    ('770e8400-e29b-41d4-a716-446655440012', 'Ceramic Vase Set', 'Set of 3 ceramic vases in different sizes', 149.00, '550e8400-e29b-41d4-a716-446655440009', null, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', ARRAY['ceramic', 'vases', 'set', 'decorative'], 0.4, 3.9, false, 30),
    ('770e8400-e29b-41d4-a716-446655440013', 'Decorative Throw Pillows', 'Set of 4 decorative throw pillows with various patterns', 89.00, '550e8400-e29b-41d4-a716-446655440005', null, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', ARRAY['pillows', 'decorative', 'patterns', 'comfortable'], 0.7, 4.2, false, 40),
    ('770e8400-e29b-41d4-a716-446655440014', 'Luxury Throw Blanket', 'Soft cashmere throw blanket for cozy comfort', 199.00, '550e8400-e29b-41d4-a716-446655440005', null, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', ARRAY['cashmere', 'throw', 'luxury', 'cozy'], 0.6, 4.4, false, 22),
    
    -- Storage & Organization products
    ('770e8400-e29b-41d4-a716-446655440015', 'Modern Storage Cabinet', 'Sleek storage cabinet with multiple compartments', 599.00, '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', ARRAY['storage', 'cabinet', 'modern', 'organization'], 0.5, 4.1, false, 8),
    ('770e8400-e29b-41d4-a716-446655440016', 'Bamboo Drawer Organizer', 'Eco-friendly bamboo drawer organizer set', 49.00, '550e8400-e29b-41d4-a716-446655440006', null, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', ARRAY['bamboo', 'organizer', 'eco-friendly', 'drawer'], 0.3, 3.8, false, 50),
    
    -- Kitchen & Dining Accessories products
    ('770e8400-e29b-41d4-a716-446655440017', 'Stainless Steel Kitchen Set', 'Complete stainless steel kitchen utensil set', 199.00, '550e8400-e29b-41d4-a716-446655440007', null, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', ARRAY['stainless-steel', 'kitchen', 'utensils', 'complete'], 0.4, 4.0, false, 35),
    ('770e8400-e29b-41d4-a716-446655440018', 'Ceramic Dinnerware Set', 'Elegant ceramic dinnerware set for 8 people', 299.00, '550e8400-e29b-41d4-a716-446655440007', null, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', ARRAY['ceramic', 'dinnerware', 'elegant', 'set'], 0.6, 4.3, false, 20),
    
    -- Bathroom Accessories products
    ('770e8400-e29b-41d4-a716-446655440019', 'Modern Bathroom Vanity', 'Contemporary bathroom vanity with marble top', 1299.00, '550e8400-e29b-41d4-a716-446655440008', null, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', ARRAY['vanity', 'marble', 'modern', 'bathroom'], 0.7, 4.5, true, 6),
    ('770e8400-e29b-41d4-a716-446655440020', 'Rainfall Shower Head', 'Luxury rainfall shower head with multiple settings', 199.00, '550e8400-e29b-41d4-a716-446655440008', null, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', ARRAY['shower', 'rainfall', 'luxury', 'settings'], 0.5, 4.2, false, 25),
    
    -- Technology & Smart Devices products
    ('770e8400-e29b-41d4-a716-446655440021', 'Smart Home Hub', 'Central smart home control hub with voice assistant', 299.00, '550e8400-e29b-41d4-a716-446655440010', null, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', ARRAY['smart', 'hub', 'voice', 'control'], 0.8, 4.6, true, 15),
    ('770e8400-e29b-41d4-a716-446655440022', 'Smart Light Bulbs', 'WiFi-enabled smart light bulbs with color control', 89.00, '550e8400-e29b-41d4-a716-446655440010', null, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', ARRAY['smart', 'bulbs', 'wifi', 'color'], 0.6, 4.1, false, 40),
    
    -- Outdoor/Patio Interior products
    ('770e8400-e29b-41d4-a716-446655440023', 'Outdoor Sectional Set', 'Weather-resistant outdoor sectional seating set', 1599.00, '550e8400-e29b-41d4-a716-446655440011', null, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', ARRAY['outdoor', 'sectional', 'weather-resistant', 'patio'], 0.7, 4.4, false, 10),
    ('770e8400-e29b-41d4-a716-446655440024', 'Patio Dining Table', 'Rustic outdoor dining table for 6 people', 899.00, '550e8400-e29b-41d4-a716-446655440011', null, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', ARRAY['patio', 'dining', 'rustic', 'outdoor'], 0.5, 4.0, false, 12);

-- Create a function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_sequence')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- Create a function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, first_name, last_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
