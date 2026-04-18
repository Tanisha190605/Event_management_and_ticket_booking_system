# 🚀 Running EMATBS Locally from Scratch

Follow this step-by-step guide to run the Event Management and Ticket Booking System (EMATBS) on your local machine.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your system:
1. **Node.js** (v18 or higher recommended) - [Download Here](https://nodejs.org/)
2. **MongoDB** - You can install [MongoDB Community Server](https://www.mongodb.com/try/download/community) locally, or use a free cloud database via [MongoDB Atlas](https://www.mongodb.com/atlas/database).
3. **Git** (optional, to clone the repo) - [Download Here](https://git-scm.com/)

---

## 💻 Step 1: Get the Code

If you haven't already, clone the repository or download the ZIP file and extract it.

```bash
git clone https://github.com/Tanisha190605/Event_management_and_ticket_booking_system.git
cd Event_management_and_ticket_booking_system
```

---

## 🖧 Step 2: Set Up the Backend

The backend server is powered by Node.js and Express, and runs on port `5000` by default.

### 2.1. Install Dependencies
Open a terminal in the root project folder and navigate to the backend directory:
```bash
cd backend
npm install
```

### 2.2. Configure Environment Variables
Inside the `backend` folder, create a new file exactly named `.env`. Copy the text below and paste it inside `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ematbs
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
NODE_ENV=development

# Email Configuration (Nodemailer requires a Gmail App Password)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=noreply@ematbs.com

# Razorpay Test Credentials (Sign up for Razorpay for test keys, or leave dummy values if testing without payment)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL reference
FRONTEND_URL=http://localhost:5173
```
*(Note: If you use MongoDB Atlas, replace the `MONGODB_URI` with your connection string).*

### 2.3. Start the Server
```bash
npm run dev
```
You should see output in your terminal confirming:
`MongoDB Connected: 127.0.0.1` and `Server running in development mode on port 5000`.

---

## 🎨 Step 3: Set Up the Frontend

The frontend is a Vite application running on port `5173`.

### 3.1. Open a New Terminal
Leave the backend terminal running! Open a **second** terminal window/tab and navigate to the frontend folder:
```bash
cd frontend
npm install
```

### 3.2. Start the Frontend Server
```bash
npm run dev
```
You should see an output indicating the server is running on `http://localhost:5173/`.

---

## 🎉 Step 4: Access the Application!

1. Open your web browser.
2. Navigate to: **`http://localhost:5173/`**
3. The system is fully operational! 

### Admin Access
To manage events, you will need an admin account. If no admin exists in the database, the backend automatically creates a default one upon server startup:
- **Email:** `admin@ematbs.com`
- **Password:** `admin123`
