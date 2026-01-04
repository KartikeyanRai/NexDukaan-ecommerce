
🛒 
# NexDukaan — Modern E-Commerce Platform

### DEMO VIDEO LINK: https://drive.google.com/drive/folders/1YFnKEEzJFtSOcEXebaAbOR16K9nA-SdX?usp=sharing

### VERCEL LINK: https://nex-dukaan-ecommerce-4fny-lpkskyw0y-kartikeyan-rais-projects.vercel.app

![alt text](images/image-1.png)
 
NexDukaan is a full-stack, responsive e-commerce platform built using a Monorepo architecture.
It includes a powerful Admin Dashboard for store management and a fast, SEO-optimized Client Shop for customers.
Built with Next.js 15 (App Router) on the frontend and Node.js / Express with MongoDB on the backend.


________________________________________
🚀 Key Features

🛍️ Client Storefront (Public)

•	Static & Fast
  o	Optimized using Next.js Static Generation for SEO and ultra-fast load times

•	Smart Search
  o	Real-time product filtering using URL parameters
  o	Suspense-optimized rendering

•	Seamless Checkout
  o	Custom modal-based checkout flow
  o	Simulated credit card processing
  o	Stock validation before order placement

•	Responsive UI
  o	Fully mobile-responsive design with Tailwind CSS

•	Order History
  o	Secure, dynamic order tracking for logged-in users


________________________________________
📊 Admin Dashboard (Private)

•	Store Isolation
  o	Multi-tenant architecture ensures admins access only their store data

•	Smart Sidebar
  o	Collapsible navigation
  o	Auto-shrinks on mobile while remaining fully interactive

•	Real-Time Analytics
  o	Interactive revenue trends (Line Charts)
  o	Inventory distribution (Pie / Bar Charts)
  o	KPI tracking:
    	Fulfillment Rate
    	Average Order Value

•	Inventory Management
  o	Add, edit, and manage product stock
  o	Low-stock alerts when threshold is reached

•	Export Data
  o	CSV export for financial and sales reporting


________________________________________
🛡️ Security & Architecture

•	Role-Based Access Control (RBAC)
  o	Middleware-protected routes:
    	/dashboard → Admins
    	/shop → Clients

•	Hybrid Rendering
  o	Static Routes: /shop (performance-optimized)
  o	Dynamic Routes: /dashboard, /orders (real-time data)

•	Secure Authentication
  o	HTTP-only cookies using nookies
  o	JWT-based authentication

________________________________________
🛠️ Tech Stack

Frontend
  •	Framework: Next.js 15 (App Router)
  •	Styling: Tailwind CSS
  •	Icons: Lucide React
  •	Charts: Recharts
  •	HTTP Client: Axios
  •	State Management: React Hooks (useState, useEffect, Suspense)

Backend
  •	Runtime: Node.js
  •	Framework: Express.js
  •	Database: MongoDB (Mongoose ODM)
  •	Authentication: JSON Web Tokens (JWT)
  •	Security: CORS, Helmet, BCrypt


________________________________________
📂 Project Structure

```bash
ECOMM_DASHBOARD/
├── FRONTEND/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (client)/
│   │   │   ├── (dashboard)/
│   │   │   └── api/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
├── BACKEND/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

________________________________________
⚡ Getting Started

Prerequisites
•	Node.js v18+
•	MongoDB connection string (Atlas or Local)

________________________________________
1️⃣ Installation

  git clone https://github.com/yourusername/nexdukaan-ecommerce.git

  cd nexdukaan-ecommerce

________________________________________
2️⃣ Backend Setup

  cd BACKEND

  npm install

  Create a .env file inside BACKEND/:

  PORT=5000

  MONGO_URI=your_mongodb_connection_string

  JWT_SECRET=your secret key

  Start the backend server:

  npm start

________________________________________
3️⃣ Frontend Setup

  cd ../FRONTEND

  npm install

  Create a .env.local file inside FRONTEND/:

  NEXT_PUBLIC_API_URL=http://localhost:5000/api

  Start the frontend:

  npm run dev

  Visit 👉 http://localhost:3000


________________________________________
🚀 Deployment Guide

Frontend (Vercel)

  1.	Root Directory: FRONTEND
  2.	Build Command: npm run build
  3.	Output Directory: Default
  4.	Environment Variables:
  5.	NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api

________________________________________
Backend (Render / Heroku)

  1.	Root Directory: BACKEND
  2.	Build Command: npm install
  3.	Start Command: node server.js
  4.	Environment Variables:
    o	MONGO_URI
    o	JWT_SECRET
________________________________________
📸 Screenshots

•	Home Page
![alt text](images/image-10.png)

•	Sign-Up Page
![alt text](images/image-8.png)

•	Login Page
![alt text](images/image-9.png)

Client Side
  •	Shop Page
  ![alt text](images/image-6.png)
  
  •	Order History Page
  ![alt text](images/image-7.png)
 
Admin Dashboard
![alt text](images/image-1.png)
 
  1.	Products Page
  ![alt text](images/image-2.png)
  
  2.	Orders Page
  ![alt text](images/image-3.png)
  
  3.	Analytics Page
  ![alt text](images/image-4.png)
  
  4.	Add Admin Page
  ![alt text](images/image-5.png)


________________________________________
🤝 Contributing

Contributions are welcome!
  1.	Fork the repository

  2.	Create your feature branch

  3.	git checkout -b feature/AmazingFeature

  4.	Commit your changes

  5.	git commit -m "Add AmazingFeature"

  6.	Push to the branch

  7.	git push origin feature/AmazingFeature

  8.	Open a Pull Request

