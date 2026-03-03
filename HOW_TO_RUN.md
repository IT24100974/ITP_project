# How to Run the Tuition Management System Locally

This guide will walk you through setting up and running the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) - [Download here](https://git-scm.com/)

## Step-by-Step Setup

### 1. Download/Clone the Project

If you have the project folder:
```bash
cd "C:\Users\MSI\Desktop\New folder (2)"
```

Or if using Git:
```bash
git clone <repository-url>
cd tuition-management-system
```

---

## Backend Setup

### 2. Navigate to Backend Directory

```bash
cd backend
```

### 3. Install Backend Dependencies

```bash
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- multer

### 4. Configure Environment Variables

1. Open the `backend/.env` file
2. Update with your MongoDB connection string:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/tuition_management?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:**
- Replace `your_username` with your MongoDB username
- Replace `your_password` with your MongoDB password
- Replace `cluster0.xxxxx` with your actual cluster URL
- Change `JWT_SECRET` to a random secure string

### 5. Start Backend Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server is running on port 5000
```

**Keep this terminal window open!**

---

## Frontend Setup

### 6. Open New Terminal

Open a **new terminal window/tab** (keep backend running)

### 7. Navigate to Frontend Directory

```bash
cd frontend
```

If you're in the backend folder:
```bash
cd ../frontend
```

### 8. Install Frontend Dependencies

```bash
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- vite

### 9. Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 10. Open the Application

Open your browser and go to:
```
http://localhost:3000
```

---

## Creating Test Users

### Method 1: Using the Register API

You can use **Postman**, **Thunder Client**, or **curl** to create users.

**Create Admin User:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "phone": "1234567890",
  "address": "123 Admin Street",
  "role": "admin"
}
```

**Create Student User:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "student@example.com",
  "password": "student123",
  "phone": "9876543210",
  "address": "456 Student Avenue",
  "className": "Class 10",
  "role": "student"
}
```

### Method 2: Using MongoDB Compass

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MongoDB connection string
3. Navigate to `tuition_management` database
4. Create documents in the `users` collection

**Note:** Passwords are automatically hashed by the User model.

---

## Testing the Application

### Login Credentials

After creating test users, you can login with:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Student:**
- Email: `student@example.com`
- Password: `student123`

### Admin Features to Test

1. **Dashboard**: View statistics
2. **Add Student**: Create new student accounts
3. **Manage Students**: Edit, delete, search students
4. **Add Exam**: Create exam records with marks
5. **View Exams**: See all exam records with grades

### Student Features to Test

1. **Dashboard**: View profile and exam statistics
2. **Profile**: View personal details
3. **My Exams**: View exam results and grades

---

## Project URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Test**: http://localhost:5000/api/auth/me (with Authorization header)

---

## Common Commands

### Backend Commands

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

### Frontend Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Troubleshooting

### Backend Issues

**Problem:** MongoDB connection error
```
Solution:
- Check MongoDB Atlas IP whitelist
- Verify connection string in .env
- Ensure database user exists
```

**Problem:** Port 5000 already in use
```bash
Solution:
# Change PORT in backend/.env to different port (e.g., 5001)
# Update vite.config.js proxy target in frontend
```

**Problem:** Cannot find module errors
```bash
Solution:
cd backend
rm -rf node_modules
npm install
```

### Frontend Issues

**Problem:** Network error / API calls failing
```
Solution:
- Ensure backend is running on port 5000
- Check console for CORS errors
- Verify proxy settings in vite.config.js
```

**Problem:** Blank page on load
```bash
Solution:
# Clear cache and reload
- Press Ctrl + Shift + R (Windows/Linux)
- Press Cmd + Shift + R (Mac)
```

**Problem:** Module not found
```bash
Solution:
cd frontend
rm -rf node_modules
npm install
```

---

## Development Workflow

### 1. Starting Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Making Changes

- Backend changes (API) → Server auto-restarts
- Frontend changes → Page auto-reloads
- CSS changes → Instant hot reload

### 3. Testing API Endpoints

Use tools like:
- **Postman**: https://www.postman.com/
- **Thunder Client**: VS Code Extension
- **Insomnia**: https://insomnia.rest/

### 4. Stopping Servers

Press `Ctrl + C` in each terminal to stop the servers

---

## Building for Production

### Backend

```bash
cd backend
npm start
```

Set `NODE_ENV=production` in `.env`

### Frontend

```bash
cd frontend
npm run build
```

This creates a `dist` folder with optimized files.

To preview:
```bash
npm run preview
```

---

## File Structure Overview

```
📦 Project Root
├── 📂 backend
│   ├── 📂 config         # Database configuration
│   ├── 📂 controllers    # Business logic
│   ├── 📂 middleware     # Auth & validation
│   ├── 📂 models         # Database schemas
│   ├── 📂 routes         # API endpoints
│   ├── 📄 server.js      # Express app
│   ├── 📄 .env           # Environment variables
│   └── 📄 package.json   # Backend dependencies
│
├── 📂 frontend
│   ├── 📂 src
│   │   ├── 📂 components # Reusable components
│   │   ├── 📂 pages      # Page components
│   │   ├── 📂 context    # Global state
│   │   ├── 📂 services   # API calls
│   │   ├── 📂 css        # Stylesheets
│   │   ├── 📄 App.jsx    # Main app
│   │   └── 📄 main.jsx   # Entry point
│   ├── 📄 index.html     # HTML template
│   └── 📄 package.json   # Frontend dependencies
│
└── 📄 README.md          # Project documentation
```

---

## Need Help?

### Check:
1. ✅ Backend server is running (Terminal 1)
2. ✅ Frontend server is running (Terminal 2)
3. ✅ MongoDB Atlas is configured correctly
4. ✅ .env file has correct values
5. ✅ Dependencies are installed (node_modules exists)

### Common Solutions:
- Restart both servers
- Clear browser cache
- Check browser console for errors
- Verify network tab in DevTools

---

## Next Steps

1. **Create Admin Account** using API
2. **Login as Admin** and add students
3. **Create Exam Records** for students
4. **Login as Student** to view results
5. **Explore Features** and test functionality

---

**Happy Coding! 🚀**

If you encounter any issues, check the error messages carefully and verify all setup steps.
