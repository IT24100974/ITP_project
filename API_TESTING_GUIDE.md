# API Testing Guide

This document provides sample API requests for testing the Tuition Management System backend.

## Base URL

```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. Register New User

**Endpoint:** `POST /api/auth/register`

**Request Body (Admin):**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "phone": "1234567890",
  "address": "123 Admin Street, City",
  "role": "admin"
}
```

**Request Body (Student):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "john123",
  "phone": "9876543210",
  "address": "456 Student Avenue, City",
  "className": "Class 10",
  "photo": "https://via.placeholder.com/150",
  "role": "student"
}
```

**Response:**
```json
{
  "_id": "65xxx...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "456 Student Avenue, City",
  "class": "Class 10",
  "photo": "https://via.placeholder.com/150",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "_id": "65xxx...",
  "name": "Admin User",
  "email": "admin@example.com",
  "phone": "1234567890",
  "address": "123 Admin Street, City",
  "class": "",
  "photo": "https://via.placeholder.com/150",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** Save the `token` for subsequent requests!

---

### 3. Get Current User Profile

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <your_token_here>
```

**Response:**
```json
{
  "_id": "65xxx...",
  "name": "Admin User",
  "email": "admin@example.com",
  "phone": "1234567890",
  "address": "123 Admin Street, City",
  "class": "",
  "photo": "https://via.placeholder.com/150",
  "role": "admin"
}
```

---

## 👨‍🎓 Student Management (Admin Only)

**Note:** All student endpoints require:
- Valid JWT token in Authorization header
- Admin role

---

### 4. Get All Students

**Endpoint:** `GET /api/students`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters (Optional):**
```
?search=john          # Search by name or email
?class=Class 10       # Filter by class
```

**Response:**
```json
[
  {
    "_id": "65xxx...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "456 Student Avenue",
    "class": "Class 10",
    "photo": "https://via.placeholder.com/150",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 5. Get Single Student

**Endpoint:** `GET /api/students/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Example:** `GET /api/students/65xxx...`

**Response:**
```json
{
  "_id": "65xxx...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "456 Student Avenue",
  "class": "Class 10",
  "photo": "https://via.placeholder.com/150",
  "role": "student"
}
```

---

### 6. Create New Student

**Endpoint:** `POST /api/students`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "jane123",
  "phone": "1112223333",
  "address": "789 Learning Lane",
  "className": "Class 9",
  "photo": "https://via.placeholder.com/150"
}
```

**Response:**
```json
{
  "_id": "65yyy...",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "1112223333",
  "address": "789 Learning Lane",
  "class": "Class 9",
  "photo": "https://via.placeholder.com/150",
  "role": "student"
}
```

---

### 7. Update Student

**Endpoint:** `PUT /api/students/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "9999999999",
  "address": "New Address",
  "className": "Class 11",
  "photo": "https://via.placeholder.com/150"
}
```

**Response:**
```json
{
  "_id": "65xxx...",
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "9999999999",
  "address": "New Address",
  "class": "Class 11",
  "photo": "https://via.placeholder.com/150",
  "role": "student"
}
```

---

### 8. Delete Student

**Endpoint:** `DELETE /api/students/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Student removed successfully"
}
```

---

### 9. Get Students by Class

**Endpoint:** `GET /api/students/class/:className`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Example:** `GET /api/students/class/Class 10`

**Response:**
```json
[
  {
    "_id": "65xxx...",
    "name": "John Doe",
    "class": "Class 10",
    ...
  },
  {
    "_id": "65yyy...",
    "name": "Alice Brown",
    "class": "Class 10",
    ...
  }
]
```

---

## 📝 Exam Management

---

### 10. Create Exam Record (Admin Only)

**Endpoint:** `POST /api/exams`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentId": "65xxx...",
  "subject": "Mathematics",
  "marks": 85,
  "totalMarks": 100,
  "examDate": "2024-01-15"
}
```

**Response:**
```json
{
  "_id": "66xxx...",
  "studentId": {
    "_id": "65xxx...",
    "name": "John Doe",
    "email": "john@example.com",
    "class": "Class 10"
  },
  "subject": "Mathematics",
  "marks": 85,
  "totalMarks": 100,
  "percentage": "85.00",
  "grade": "A",
  "examDate": "2024-01-15T00:00:00.000Z"
}
```

**Note:** Percentage and grade are auto-calculated!

---

### 11. Get All Exams (Admin Only)

**Endpoint:** `GET /api/exams`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
[
  {
    "_id": "66xxx...",
    "studentId": {
      "_id": "65xxx...",
      "name": "John Doe",
      "email": "john@example.com",
      "class": "Class 10"
    },
    "subject": "Mathematics",
    "marks": 85,
    "totalMarks": 100,
    "percentage": "85.00",
    "grade": "A",
    "examDate": "2024-01-15T00:00:00.000Z"
  }
]
```

---

### 12. Get Student's Exam Records

**Endpoint:** `GET /api/exams/student/:studentId`

**Headers:**
```
Authorization: Bearer <token>
```

**Note:** 
- Admin can view any student's exams
- Students can only view their own exams

**Response:**
```json
{
  "exams": [
    {
      "_id": "66xxx...",
      "studentId": {
        "_id": "65xxx...",
        "name": "John Doe",
        "email": "john@example.com",
        "class": "Class 10"
      },
      "subject": "Mathematics",
      "marks": 85,
      "totalMarks": 100,
      "percentage": "85.00",
      "grade": "A",
      "examDate": "2024-01-15T00:00:00.000Z"
    },
    {
      "_id": "66yyy...",
      "subject": "Science",
      "marks": 92,
      "totalMarks": 100,
      "percentage": "92.00",
      "grade": "A+",
      "examDate": "2024-01-16T00:00:00.000Z"
    }
  ],
  "statistics": {
    "totalExams": 2,
    "totalMarksObtained": 177,
    "totalMaxMarks": 200,
    "averagePercentage": "88.50"
  }
}
```

---

### 13. Get Single Exam Record

**Endpoint:** `GET /api/exams/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "66xxx...",
  "studentId": {
    "_id": "65xxx...",
    "name": "John Doe",
    "email": "john@example.com",
    "class": "Class 10"
  },
  "subject": "Mathematics",
  "marks": 85,
  "totalMarks": 100,
  "percentage": "85.00",
  "grade": "A",
  "examDate": "2024-01-15T00:00:00.000Z"
}
```

---

### 14. Update Exam Record (Admin Only)

**Endpoint:** `PUT /api/exams/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subject": "Mathematics - Final",
  "marks": 90,
  "totalMarks": 100,
  "examDate": "2024-01-20"
}
```

**Response:**
```json
{
  "_id": "66xxx...",
  "subject": "Mathematics - Final",
  "marks": 90,
  "totalMarks": 100,
  "percentage": "90.00",
  "grade": "A+",
  "examDate": "2024-01-20T00:00:00.000Z"
}
```

---

### 15. Delete Exam Record (Admin Only)

**Endpoint:** `DELETE /api/exams/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "message": "Exam record removed successfully"
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin only."
}
```

### 404 Not Found
```json
{
  "message": "Student not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error message"
}
```

---

## 🧪 Testing Tools

### Postman
1. Create new collection "Tuition Management"
2. Add environment variable `baseUrl`: `http://localhost:5000/api`
3. Add environment variable `token`: (set after login)
4. Use `{{baseUrl}}` and `{{token}}` in requests

### Thunder Client (VS Code Extension)
1. Install Thunder Client extension
2. Create new request
3. Set Authorization header: `Bearer <token>`
4. Test endpoints

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Get Students:**
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer <your_token>"
```

**Create Exam:**
```bash
curl -X POST http://localhost:5000/api/exams \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "65xxx...",
    "subject": "Mathematics",
    "marks": 85,
    "totalMarks": 100
  }'
```

---

## 📊 Grade Calculation Reference

| Percentage | Grade |
|------------|-------|
| 90% - 100% | A+    |
| 80% - 89%  | A     |
| 70% - 79%  | B     |
| 60% - 69%  | C     |
| 50% - 59%  | D     |
| 0% - 49%   | F     |

---

## 🔑 Important Notes

1. **Always include Authorization header** for protected routes
2. **Admin token required** for admin-only endpoints
3. **Students can only access** their own data
4. **Percentage and grade** are automatically calculated
5. **Password is never returned** in API responses
6. **Token expires** in 30 days

---

**Happy Testing! 🚀**
