# Tuition Class Management System

A full-stack web application for managing tuition classes, students, and exam records using the MERN stack.

## 🚀 Tech Stack

- **Frontend:** React (Vite), React Router, Axios, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** Pure CSS (No frameworks)
- **Architecture:** MVC Pattern

## ✨ Features

### Authentication System
- JWT-based authentication
- Role-based authorization (Admin & Student)
- Secure password hashing with bcrypt
- Protected routes and middleware

### Admin Dashboard
- View statistics (Total Students, Total Exams, Average Performance)
- **Interactive charts** showing exams per subject and average performance by subject
- Student Management (CRUD operations)
- Exam Management (Create, View, Delete exam records)
- Search and filter students
- Automatic grade calculation

### Student Dashboard
- View personal profile
- View exam results
- View grades and performance statistics
- Access only personal data

## 📁 Project Structure

```
tuition-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── studentController.js  # Student CRUD operations
│   │   └── examController.js     # Exam management
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── roleAuth.js           # Role-based authorization
│   ├── models/
│   │   ├── User.js               # User/Student model
│   │   └── Exam.js               # Exam model
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── studentRoutes.js      # Student endpoints
│   │   └── examRoutes.js         # Exam endpoints
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── StudentRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── StudentManagement.jsx
│   │   │   ├── AddStudent.jsx
│   │   │   ├── EditStudent.jsx
│   │   │   ├── ExamManagement.jsx
│   │   │   ├── StudentExams.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios configuration
│   │   ├── css/
│   │   │   ├── styles.css
│   │   │   ├── navbar.css
│   │   │   ├── login.css
│   │   │   ├── dashboard.css
│   │   │   └── forms.css
│   │   ├── App.jsx               # Main app with routes
│   │   └── main.jsx              # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  class: String,
  photo: String (URL),
  role: String (admin/student)
}
```

### Exam Model
```javascript
{
  studentId: ObjectId (ref: User),
  subject: String,
  marks: Number,
  totalMarks: Number,
  percentage: Number (auto-calculated),
  grade: String (auto-calculated: A+, A, B, C, D, F),
  examDate: Date
}
```

## 🔐 API Endpoints

### Authentication Routes
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (Protected)
```

### Student Routes (Admin Only)
```
GET    /api/students              - Get all students
GET    /api/students/:id          - Get single student
POST   /api/students              - Create student
PUT    /api/students/:id          - Update student
DELETE /api/students/:id          - Delete student
GET    /api/students/class/:name  - Get students by class
```

### Exam Routes
```
POST   /api/exams                      - Create exam (Admin)
GET    /api/exams                      - Get all exams (Admin)
GET    /api/exams/student/:studentId   - Get student exams
GET    /api/exams/:id                  - Get single exam
PUT    /api/exams/:id                  - Update exam (Admin)
DELETE /api/exams/:id                  - Delete exam (Admin)
```

## 📊 Grade Calculation

The system automatically calculates grades based on percentage:

- **A+**: 90% and above
- **A**: 80% - 89%
- **B**: 70% - 79%
- **C**: 60% - 69%
- **D**: 50% - 59%
- **F**: Below 50%

## 🎨 Features Highlights

### Security
✅ JWT authentication
✅ Password hashing with bcrypt
✅ Protected routes
✅ Role-based access control
✅ Password not returned in API responses

### Frontend
✅ Responsive design
✅ Clean UI with pure CSS
✅ Form validation
✅ Error and success messages
✅ Context API for state management
✅ Protected and role-based routes

### Backend
✅ MVC architecture
✅ RESTful API design
✅ MongoDB relationships
✅ Input validation
✅ Error handling middleware

## 👥 User Roles

### Admin
- Manage students (Add, Edit, Delete)
- Assign classes to students
- Create and manage exams
- View all statistics
- Search and filter students

### Student
- View personal profile
- View exam results
- View grades and performance
- Cannot access other students' data

## 🎯 Key Functionalities

1. **Authentication**: Secure login/logout with JWT tokens
2. **Student Management**: Complete CRUD operations for students
3. **Exam Management**: Create exams, add marks, automatic grading
4. **Dashboard**: Different dashboards for Admin and Student
5. **Search & Filter**: Find students by name, email, or class
6. **Statistics**: Track performance metrics and averages
7. **Responsive Design**: Works on desktop and mobile devices

## 🔒 Environment Variables

Required environment variables in `.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## 📝 Notes

- Default student photo URL is used if none provided
- Passwords must be at least 6 characters
- All API requests require valid JWT token (except login/register)
- Admins cannot access student-only routes and vice versa
- Exam percentage and grade are automatically calculated

## 🤝 Contributing

This is a learning project. Feel free to fork and modify as needed.

## 📄 License

ISC

---

**Built with ❤️ using MERN Stack**
