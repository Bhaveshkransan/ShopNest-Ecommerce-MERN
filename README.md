# ShopNest - Full Stack MERN E-Commerce Web Application

ShopNest is a premium, feature-rich E-Commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). It integrates Redux Toolkit for state management, Cloudinary for media uploads, and Razorpay for payment processing, alongside a comprehensive Admin control panel.

---

## 🚀 Key Features

### 👤 Customer Features
- **User Authentication**: Register & Login with JWT session persistence (doesn't log out on page refreshes).
- **Product Catalog**: Live search, featured categories, and rich detailed description views.
- **Cart Management (Redux)**: Live cart updates, quantity increments/decrements, and localStorage caching.
- **Secure Checkout**: Shipping address verification and dynamic order placement.
- **Payment Processing**: Integrates **Razorpay Test Gateway** for card/UPI sandbox testing, alongside a **Bypass Sandbox Mode** for local trial checkouts.
- **Order Tracking & Profile**: Profile dashboard showing order history, order items list, total amounts, and delivery status tracking.

### 👑 Administrator Features
- **Overview Analytics**: Dynamic dashboard showing total revenue, order count, total products catalog size, and registered customer count.
- **Inventory Control (CRUD)**: Add new products with file upload directly to Cloudinary, update product listings, and remove products.
- **Order Management**: Monitor all customer transactions. Expand details to see ordered items, shipping addresses, transaction codes, and update statuses (Pending, Processing, Shipped, Delivered, Cancelled) dynamically.
- **User Directory**: Browse registered accounts with avatar generation, registration dates, and role tags.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Redux Toolkit, Vanilla CSS, React Router DOM.
- **Backend**: Node.js, Express.js, Multer (file parsing), Nodemailer (emails).
- **Database**: MongoDB (via Mongoose ODM).
- **Cloud Storage**: Cloudinary (for product images).
- **Payment Gateway**: Razorpay.

---

## 📁 Project Structure

```text
ShopNest/
├── backend/
│   ├── config/          # DB connection & Cloudinary configurations
│   ├── controllers/     # API request handling controllers
│   ├── middleware/      # Auth & Admin route protections
│   ├── model/           # MongoDB schemas
│   ├── routes/          # API endpoint routes mapping
│   ├── utils/           # NodeMailer SMTP utils
│   ├── index.js         # Backend Entry point
│   └── seed.js          # Database seeding script
├── frontend/
│   ├── src/
│   │   ├── admin/       # Admin Dashboard panels
│   │   ├── components/  # Navbars, Footers, and Cards
│   │   ├── context/     # Auth React Context
│   │   ├── pages/       # Customer pages (Cart, Checkout, Profile, Home)
│   │   ├── redux/       # Store & Cart slices
│   │   └── styles/      # Modular stylesheets
│   └── vite.config.js   # Client configuration & API Proxy mapping
├── package.json         # Concurrent runner scripts
└── README.md
```

---

## 🔧 Installation & Setup

Follow these steps to set up and run ShopNest locally:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "ShopNest - ECOM MERN"
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` folder and configure the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Razorpay Test Credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary Credentials (for product image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# NodeMailer Email Credentials (SMTP welcome and checkout receipts)
EMAIL_USER=your_email_address@gmail.com
EMAIL_PASS=your_email_app_password
```

### 3. Install Dependencies
Run the utility command from the root directory to install all packages for both the client and server:
```bash
npm run install-all
```

### 4. Seed the Database
Populate your database with default products and default accounts (Admin and Customers):
```bash
npm run seed
```

### 5. Start Development Servers
Run the development runner to spin up both Vite (frontend on port 5173/5174) and Nodemon (backend on port 5000) concurrently:
```bash
npm run dev
```

---

## 🔑 Demo Accounts

Use these pre-seeded accounts to explore the application:

### Customer Account
- **Email**: `john@example.com`
- **Password**: `User123!`

### Administrator Account
- **Email**: `admin@example.com`
- **Password**: `Admin123!`
