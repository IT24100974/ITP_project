const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Function to softly load routes and handle both ES modules and CommonJS
const fs = require('fs');
const loadRoute = (apiPath, routePath) => {
  try {
    const fullPath = path.join(__dirname, routePath + '.js');
    if (fs.existsSync(fullPath)) {
      const router = require(routePath);
      app.use(apiPath, router.default || router);
    } else {
      console.warn(`Warning: Route file not found: ${routePath}`);
    }
  } catch (error) {
    console.error(`Error loading route ${routePath}:`, error.message);
  }
};

// Routes
loadRoute('/api/auth', './routes/authRoutes');
loadRoute('/api/users', './routes/userRoutes');
loadRoute('/api/classes', './routes/classRoutes');
loadRoute('/api/teachers', './routes/teacherRoutes');
loadRoute('/api/students', './routes/studentRoutes');
loadRoute('/api/halls', './routes/hallRoutes');
loadRoute('/api/enrollments', './routes/enrollmentRoutes');
loadRoute('/api/payments', './routes/paymentRoutes');
loadRoute('/api/settings', './routes/settingsRoutes');
loadRoute('/api/attendance', './routes/attendanceRoutes');
loadRoute('/api/exams', './routes/examRoutes');
loadRoute('/api/paper-panel', './routes/paperPanelRoutes');
loadRoute('/api/materials', './routes/materialRoutes');
loadRoute('/api/announcements', './routes/announcementRoutes');
loadRoute('/api/notifications', './routes/notificationRoutes');
loadRoute('/api/service-requests', './routes/serviceRequestRoutes');
loadRoute('/api/dashboard', './routes/dashboardRoutes');
loadRoute('/api/revenue', './routes/revenueRoutes');
loadRoute('/api/profile', './routes/profileRoutes');
loadRoute('/api/teacher-attendance', './routes/teacherAttendanceRoutes');

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
