# 🎉 Event Management & Ticket Booking System (EMATBS)

A comprehensive, futuristic **Event Management and Ticket Booking System** designed for users to effortlessly discover events, select seats, book tickets securely, and for administrators to fully manage events and bookings. 

Built with an ultra-modern glassmorphic UI and 3D animations powered by Three.js, EMATBS delivers a premium user experience from browsing to checkout.

---

## 🚀 Key Features

### For Users 
- **Discover Events:** Browse upcoming events, view details, and check seat availability.
- **Interactive Seat Selection:** Choose your exact seats visually before booking.
- **Secure Payments:** Integrated with Razorpay for seamless and secure checkout.
- **Digital Tickets:** Automatically receive QR-code enabled tickets upon successful booking.
- **Email Notifications:** Instant booking confirmations sent via email.
- **User Dashboard:** Manage your profile and view your past and upcoming bookings.

### For Administrators
- **Custom Admin Auth:** Secure, role-based admin login/signup portal.
- **Event Management:** Create, update, and delete events.
- **Booking Management:** View all bookings, confirm or cancel them with real-time seat inventory updates.
- **Analytics Dashboard:** Track revenue, total tickets sold, and platform growth.

---

## 🛠️ Tech Stack

### Frontend 
- **Core:** HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Build Tool:** Vite ⚡
- **Animations & Visuals:** Three.js (for futuristic 3D background effects)
- **Utilities:** QRCode Generator

### Backend
- **Core:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing.
- **Payments:** Razorpay integration
- **Email:** Nodemailer

---

## ⚙️ Project Structure

The repository is split into two distinct applications:
- `/frontend`: The Vite-powered Vanilla JS frontend SPA.
- `/backend`: The Express.js REST API.

---

## 🏁 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with a MongoDB database (local or Atlas).

### 1. Clone the repository
```bash
git clone https://github.com/Tanisha190605/Event_management_and_ticket_booking_system.git
cd Event_management_and_ticket_booking_system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory based on the following template:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ematbs
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
NODE_ENV=development

# Email Configuration (for Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@ematbs.com

# Razorpay Test Credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend App URL
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window/tab:
```bash
cd frontend
npm install
```

*(Optional)* Configure the API URL by creating a `.env` file in the `/frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```

---

## ☁️ Deployment

The project is fully configured for cloud deployment:
- **Frontend:** Readily deployable on platforms like **Vercel** or **Netlify** (includes `vercel.json` for SPA routing fallback).
- **Backend:** Readily deployable on **Render**, **Railway**, or **Heroku** (uses dynamic port binding and CORS configuration).

---

## ⭐ Note
This is a collaborative project built for learning teamwork, version control, and full-stack development, transitioning into a production-grade application featuring secure integrations and modern architectural patterns.
