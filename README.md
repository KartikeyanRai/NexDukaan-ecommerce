🛒 NexDukaan — Modern E-Commerce Platform
![alt text](images/image-1.png)


NexDukaan is a full-stack, responsive e-commerce platform built using a Monorepo architecture.
It includes a powerful Admin Dashboard for store management and a fast, SEO-optimized Client Shop for customers.

Built with Next.js 15 (App Router) on the frontend and Node.js / Express with MongoDB on the backend.

🚀 Key Features
🛍️ Client Storefront (Public)

Static & Fast

Optimized using Next.js Static Generation for SEO and ultra-fast load times

Smart Search

Real-time product filtering using URL parameters

Suspense-optimized rendering

Seamless Checkout

Custom modal-based checkout flow

Simulated credit card processing

Stock validation before order placement

Responsive UI

Fully mobile-responsive design with Tailwind CSS

Order History

Secure, dynamic order tracking for logged-in users

📊 Admin Dashboard (Private)

Store Isolation

Multi-tenant architecture ensures admins access only their store data

Smart Sidebar

Collapsible navigation

Auto-shrinks on mobile while remaining fully interactive

Real-Time Analytics

Interactive revenue trends (Line Charts)

Inventory distribution (Pie / Bar Charts)

KPI tracking:

Fulfillment Rate

Average Order Value

Inventory Management

Add, edit, and manage product stock

Low-stock alerts when threshold is reached

Export Data

CSV export for financial and sales reporting

🛡️ Security & Architecture

Role-Based Access Control (RBAC)

Middleware-protected routes:

/dashboard → Admins

/shop → Clients

Hybrid Rendering

Static Routes: /shop (performance-optimized)

Dynamic Routes: /dashboard, /orders (real-time data)

Secure Authentication

HTTP-only cookies using nookies

JWT-based authentication

🛠️ Tech Stack
Frontend

Framework: Next.js 15 (App Router)

Styling: Tailwind CSS

Icons: Lucide React

Charts: Recharts

HTTP Client: Axios

State Management: React Hooks (useState, useEffect, Suspense)

Backend

Runtime: Node.js

Framework: Express.js

Database: MongoDB (Mongoose ODM)

Authentication: JSON Web Tokens (JWT)

Security: CORS, Helmet, BCrypt

📂 Project Structure
ECOMM_DASHBOARD/
├── FRONTEND/                  # Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (client)/      # Public Shop & User Routes
│   │   │   ├── (dashboard)/   # Protected Admin Routes
│   │   │   └── api/           # Next.js Proxy API
│   │   ├── components/        # Reusable UI Components
│   │   └── lib/               # API Clients & Utilities
│   └── package.json
│
├── BACKEND/                   # Express API
│   ├── models/                # Mongoose Schemas (User, Product, Order)
│   ├── routes/                # API Endpoints
│   ├── middleware/            # Auth & Error Handling
│   └── server.js              # Entry Point
│
└── .gitignore                 # Global Ignore File

⚡ Getting Started
Prerequisites

Node.js v18+

MongoDB connection string (Atlas or Local)

1️⃣ Installation
git clone https://github.com/yourusername/nexdukaan-ecommerce.git
cd nexdukaan-ecommerce

2️⃣ Backend Setup
cd BACKEND
npm install


Create a .env file inside BACKEND/:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key


Start the backend server:

npm start

3️⃣ Frontend Setup
cd ../FRONTEND
npm install


Create a .env.local file inside FRONTEND/:

NEXT_PUBLIC_API_URL=http://localhost:5000/api


Start the frontend:

npm run dev


Visit 👉 http://localhost:3000

🚀 Deployment Guide
Frontend (Vercel)

Root Directory: FRONTEND

Build Command: npm run build

Output Directory: Default

Environment Variables:

NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api

Backend (Render / Heroku)

Root Directory: BACKEND

Build Command: npm install

Start Command: node server.js

Environment Variables:

MONGO_URI

JWT_SECRET

📸 Screenshots


Home Page
![alt text](images/image-10.png)

Sign-Up Page
![alt text](images/image-8.png)

Login Page
![alt text](images/image-9.png)

Client Side
Shop Page
![alt text](images/image-6.png)

Order History Page
![alt text](images/image-7.png)


Admin Dashboard
![alt text](images/image-1.png)

Products Page
![alt text](images/image-2.png)

Orders Page
![alt text](images/image-3.png)

Analytics Page
![alt text](images/image-4.png)

Add Admin Page
![alt text](images/image-5.png)

🤝 Contributing

Contributions are welcome!

Fork the repository

Create your feature branch

git checkout -b feature/AmazingFeature


Commit your changes

git commit -m "Add AmazingFeature"


Push to the branch

git push origin feature/AmazingFeature


Open a Pull Request


