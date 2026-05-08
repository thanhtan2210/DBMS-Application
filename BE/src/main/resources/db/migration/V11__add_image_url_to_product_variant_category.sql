-- V11: Add image_url to products, product_variants, and categories

ALTER TABLE categories ADD COLUMN image_url VARCHAR(1000);
ALTER TABLE products ADD COLUMN image_url VARCHAR(1000);
ALTER TABLE product_variants ADD COLUMN image_url VARCHAR(1000);

-- Update dummy data with placeholder images from Unsplash Source or Picsum
UPDATE categories 
SET image_url = 'https://picsum.photos/seed/cat_' || category_id || '/400/300' 
WHERE image_url IS NULL;

UPDATE products 
SET image_url = 'https://picsum.photos/seed/prod_' || product_id || '/600/600' 
WHERE image_url IS NULL;

UPDATE product_variants 
SET image_url = 'https://picsum.photos/seed/var_' || variant_id || '/600/600' 
WHERE image_url IS NULL;
