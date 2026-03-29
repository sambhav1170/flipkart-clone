const fs = require('fs');
const path = require('path');

const categories = [
  "('Electronics', 'electronics', 'https://loremflickr.com/400/400/laptop/all')",
  "('Fashion', 'fashion', 'https://loremflickr.com/400/400/jacket/all')",
  "('Home & Kitchen', 'home-kitchen', 'https://loremflickr.com/400/400/kitchen/all')",
  "('Books', 'books', 'https://loremflickr.com/400/400/books/all')",
  "('Sports', 'sports', 'https://loremflickr.com/400/400/sports/all')"
];

// Curated realistic mock data by category
const curations = {
  1: [ // Electronics
    { name: 'Samsung Galaxy S23 Ultra', brand: 'Samsung', p: 124999, img1: 'https://loremflickr.com/800/800/smartphone/all', img2: 'https://loremflickr.com/800/800/screen/all' },
    { name: 'Apple MacBook Pro M3', brand: 'Apple', p: 169900, img1: 'https://loremflickr.com/800/800/macbook/all', img2: 'https://loremflickr.com/800/800/keyboard/all' },
    { name: 'Sony Alpha 7 IV Camera', brand: 'Sony', p: 210000, img1: 'https://loremflickr.com/800/800/camera/all', img2: 'https://loremflickr.com/800/800/lens/all' },
    { name: 'LG 55 inch OLED 4K TV', brand: 'LG', p: 145000, img1: 'https://loremflickr.com/800/800/television/all', img2: 'https://loremflickr.com/800/800/display/all' },
    { name: 'Apple iPhone 15 Pro', brand: 'Apple', p: 134900, img1: 'https://loremflickr.com/800/800/iphone/all', img2: 'https://loremflickr.com/800/800/phone/all' },
    { name: 'Samsung Galaxy Watch 6', brand: 'Samsung', p: 34999, img1: 'https://loremflickr.com/800/800/smartwatch/all', img2: 'https://loremflickr.com/800/800/watch/all' },
  ],
  2: [ // Fashion
    { name: 'Nike Air Max 270 Sneakers', brand: 'Nike', p: 12995, img1: 'https://loremflickr.com/800/800/sneakers/all', img2: 'https://loremflickr.com/800/800/nike/all' },
    { name: 'Adidas Ultraboost Running Shoes', brand: 'Adidas', p: 15999, img1: 'https://loremflickr.com/800/800/shoes/all', img2: 'https://loremflickr.com/800/800/runningshoes/all' },
    { name: 'Levi Premium Trucker Jacket', brand: 'Levi', p: 4500, img1: 'https://loremflickr.com/800/800/denim/all', img2: 'https://loremflickr.com/800/800/jacket/all' },
    { name: 'Puma Esssentials T-Shirt', brand: 'Puma', p: 1299, img1: 'https://loremflickr.com/800/800/tshirt/all', img2: 'https://loremflickr.com/800/800/shirt/all' },
    { name: 'Nike Dri-FIT Shorts', brand: 'Nike', p: 2495, img1: 'https://loremflickr.com/800/800/shorts/all', img2: 'https://loremflickr.com/800/800/athleticshorts/all' },
    { name: 'Levi 501 Original Jeans', brand: 'Levi', p: 3299, img1: 'https://loremflickr.com/800/800/jeans/all', img2: 'https://loremflickr.com/800/800/denim/all' },
  ],
  3: [ // Home & Kitchen
    { name: 'Bosch 7kg Front Load Machine', brand: 'Bosch', p: 32490, img1: 'https://loremflickr.com/800/800/washingmachine/all', img2: 'https://loremflickr.com/800/800/laundry/all' },
    { name: 'Philips Air Fryer XL', brand: 'Philips', p: 8999, img1: 'https://loremflickr.com/800/800/airfryer/all', img2: 'https://loremflickr.com/800/800/appliance/all' },
    { name: 'Prestige 3L Pressure Cooker', brand: 'Prestige', p: 1450, img1: 'https://loremflickr.com/800/800/cooker/all', img2: 'https://loremflickr.com/800/800/pot/all' },
    { name: 'Philips Hue Smart Bulbs', brand: 'Philips', p: 2800, img1: 'https://loremflickr.com/800/800/bulb/all', img2: 'https://loremflickr.com/800/800/light/all' },
    { name: 'Bosch Mixer Grinder 1000W', brand: 'Bosch', p: 5499, img1: 'https://loremflickr.com/800/800/blender/all', img2: 'https://loremflickr.com/800/800/mixer/all' },
    { name: 'Prestige Gas Stove 3 Burner', brand: 'Prestige', p: 4200, img1: 'https://loremflickr.com/800/800/stove/all', img2: 'https://loremflickr.com/800/800/cooking/all' }
  ],
  4: [ // Books
    { name: 'Atomic Habits', brand: 'Penguin', p: 499, img1: 'https://loremflickr.com/800/800/book/all', img2: 'https://loremflickr.com/800/800/page/all' },
    { name: 'The Psychology of Money', brand: 'HarperCollins', p: 395, img1: 'https://loremflickr.com/800/800/finance/all', img2: 'https://loremflickr.com/800/800/reading/all' },
    { name: 'Harry Potter Box Set', brand: 'Scholastic', p: 3499, img1: 'https://loremflickr.com/800/800/magicbook/all', img2: 'https://loremflickr.com/800/800/novel/all' },
    { name: 'Rich Dad Poor Dad', brand: 'Oxford', p: 299, img1: 'https://loremflickr.com/800/800/business/all', img2: 'https://loremflickr.com/800/800/study/all' },
    { name: 'The Subtile Art of Not Giving a F', brand: 'HarperCollins', p: 450, img1: 'https://loremflickr.com/800/800/selfhelp/all', img2: 'https://loremflickr.com/800/800/diary/all' },
    { name: 'Deep Work by Cal Newport', brand: 'Penguin', p: 399, img1: 'https://loremflickr.com/800/800/library/all', img2: 'https://loremflickr.com/800/800/textbook/all' }
  ],
  5: [ // Sports
    { name: 'Yonex Astrox 99 Pro Badminton', brand: 'Yonex', p: 14500, img1: 'https://loremflickr.com/800/800/badminton/all', img2: 'https://loremflickr.com/800/800/racket/all' },
    { name: 'Spalding NBA Official Basketball', brand: 'Spalding', p: 2800, img1: 'https://loremflickr.com/800/800/basketball/all', img2: 'https://loremflickr.com/800/800/hoop/all' },
    { name: 'Nivia True Match Football', brand: 'Nivia', p: 1200, img1: 'https://loremflickr.com/800/800/football/all', img2: 'https://loremflickr.com/800/800/soccer/all' },
    { name: 'Cosco Tennis Racket', brand: 'Cosco', p: 3500, img1: 'https://loremflickr.com/800/800/tennis/all', img2: 'https://loremflickr.com/800/800/court/all' },
    { name: 'Yonex Mavis 350 Shuttlecocks', brand: 'Yonex', p: 850, img1: 'https://loremflickr.com/800/800/shuttlecock/all', img2: 'https://loremflickr.com/800/800/net/all' },
    { name: 'Nivia Dominator Goalkeeper Gloves', brand: 'Nivia', p: 950, img1: 'https://loremflickr.com/800/800/goalkeeper/all', img2: 'https://loremflickr.com/800/800/gloves/all' }
  ]
};

let products = [];
let images = [];
let specs = [];

let pid = 1;
for (let c = 1; c <= 5; c++) {
  const catItems = curations[c];
  for (let p = 0; p < 6; p++) {
    const item = catItems[p];
    const discount = Math.floor(Math.random() * 40) + 15;
    const mrp = Math.floor(item.p / (1 - discount / 100));
    const rating = parseFloat(((Math.random() * 0.8) + 4.1).toFixed(1)); // 4.1 to 4.9
    
    const desc = `Experience the best quality with this premium ${item.name} from our collection. Built to last with absolute maximum durability and verified by FlipKart.`;
    
    products.push(`('${item.name}', '${desc}', ${item.p}, ${mrp}, ${discount}, 100, ${c}, '${item.brand}', ${rating}, ${Math.floor(Math.random()*900)+100})`);
    
    // 2 specific realistic images per product
    images.push(`(${pid}, '${item.img1}', true)`);
    images.push(`(${pid}, '${item.img2}', false)`);
    
    // 3 specs per product
    specs.push(`(${pid}, 'Condition', 'Brand New in Box')`);
    specs.push(`(${pid}, 'Shipping Target', 'Verified Express')`);
    specs.push(`(${pid}, 'Warranty', '1 Year Domestic')`);
    
    pid++;
  }
}

const sql = `
-- Drop previous data if table structure changed
-- Users
INSERT INTO users (id, name, email, phone, password, role) VALUES 
(1, 'Demo User', 'demo@example.com', '9876543210', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'customer'),
(2, 'Admin User', 'admin@example.com', '9876543210', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO categories (name, slug, image_url) VALUES 
${categories.join(',\n')};

-- Products
INSERT INTO products (name, description, price, mrp, discount_percent, stock, category_id, brand, rating, rating_count) VALUES 
${products.join(',\n')};

-- Images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES 
${images.join(',\n')};

-- Specifications
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES 
${specs.join(',\n')};

-- Address
INSERT INTO addresses (user_id, full_name, phone, street, city, state, pincode, is_default) VALUES 
(1, 'Demo User', '9876543210', '123 Main Street', 'Bengaluru', 'Karnataka', '560001', true);
`;

const destPath = path.join(__dirname, 'seed.sql');
fs.writeFileSync(destPath, sql);
console.log('Hyper-Realistic Seed SQL generated at', destPath);
