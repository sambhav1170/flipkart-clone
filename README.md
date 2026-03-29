# Flipkart Clone (SDE Intern Fullstack Assignment)

A complete, functional, and deeply realistic e-commerce web application meticulously replicating the **Flipkart UI/UX**, layout structure, and interaction design. 

This full-stack project encompasses live product browsing, cart management, wishlist storage, order placements, and JWT-secured user authentication.

## ✨ Core Features Implemented
### 1. Product Listing Page
- **Grid Layout**: Accurately mimics Flipkart's specific card UI.
- **Search & Filtering**: Search dynamically by name, filter by specific categories, and utilize an advanced side parameter system to filter by Price ranges and sort by Relevance/Price/Rating.

### 2. Product Detail Page
- **Media Gallery**: Image carousel with clickable interactive thumbnails switching the primary image.
- **Data Displays**: Complex product specifications list, rich descriptions, discounted dynamic pricing, and "F-Assured" visual styling.
- **Action Buttons**: Persistent "Add to Cart" and "Buy Now" controls.

### 3. Shopping Cart Context
- Deeply integrated React Context API for Cart management.
- Users can view all items, adjust quantities, and dynamically evaluate their subtotals against free delivery thresholds.

### 4. Order & Checkout Placement
- Responsive delivery address inputs combined with persistent defaults.
- Places the full order into the PostgreSQL/SQLite database and routes the user into the Order Confirmation interface.
- **Bonus Feature Embedded**: Implemented pseudo-email notification hooks inside the `createOrder` backend controller.

### 5. Authentication & Security (Bonus)
- Rebuilt Flipkart's modal-based **Login / OTP flows**. 
- Bcrypt hashed passwords and JSON Web Tokens securely transmit state between sessions. 
- Custom protected routes on the Express Server isolate active Shopping Carts securely to individual users.

---

## 💻 Technical Stack Overview

**Frontend:**
- React (bootstrapped with Vite for instant HMR)
- React Router DOM (Declarative Client-side Routing)
- Tailwind CSS (Utility-first styling matching Flipkart's strict colors)
- Axios (API Communication)
- Lucide React (Iconography)

**Backend:**
- Node.js & Express.js (REST API Runtime)
- SQLite (Local Development) / PostgreSQL (Cloud Support Configurations)
- JSON Web Tokens (JWT) & bcryptjs (Encrypted session auth mechanism)
- Nodemailer mock (Order placement bonus requirement)

---

## ⚙️ Local Setup Instructions

### 1. Requirements
Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Backend Initialization
```bash
# Move into the backend directory
cd backend

# Install dependencies
npm install

# Build and populate the Database Sandbox
# (This creates the schema and injects the sample product mock data)
cd db && node run_sql.js && cd ..

# Launch the server (Port 5005)
npm run dev
```

### 3. Frontend Initialization
```bash
# In a new terminal, move into the frontend directory
cd frontend

# Install dependencies
npm install

# Launch the React dev server (Port 5173)
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🔒 Default Accounts (Optional)
The rubric specifies authentication isn't strictly necessary for evaluation, but the backend is built cleanly to support it alongside Wishlist saving limits. Use the pre-seeded users below or just interact directly through the OTP "Guest" flow (simulates OTP by using exactly `123456`).

- **User**: `demo@example.com` 
- **Password**: `password123`

---

## 🏗️ Assumptions & API Design Decisions
1. **Frontend Mock Integrity**: To closely replicate Flipkart's true appearance, certain features (like the side filter checkboxes) are highly styled and use strict sizing.
2. **Database Flexibility**: The backend leverages a custom `config/db.js` layer. While the initial seed runs natively via local SQLite memory (to guarantee 0 setup friction for cloning), the `.env` dynamically hooks the exact same queries directly into a Supabase PostgreSQL instance in production environments without needing code conversions.
3. **Cart Sessioning**: Unauthenticated users attempting to add to the cart are deliberately blocked and prompted by the Login Modal (via the `protect` middleware) rather than using local-storage "shadow carts" mimicking Flipkart's strict logged-in-only tracking pipeline.

*Developed specifically for the SDE Intern Evaluation.*
# flipkart-clone
