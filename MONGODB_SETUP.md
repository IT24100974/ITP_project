# MongoDB Atlas Setup Guide

Follow these steps to set up MongoDB Atlas for the Tuition Management System.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click on "Try Free" or "Sign Up"
3. Create an account using:
   - Email and password
   - Or sign up with Google account

## Step 2: Create a New Cluster

1. After logging in, click **"Build a Database"**
2. Choose the **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider:
   - AWS (recommended)
   - Google Cloud
   - Azure
4. Choose a region closest to your location
5. Click **"Create Cluster"**

## Step 3: Create Database User

1. Click on **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter username (e.g., `admin`)
5. Click **"Autogenerate Secure Password"** or create your own
6. **IMPORTANT:** Copy and save the password securely
7. Under "Database User Privileges", select **"Read and write to any database"**
8. Click **"Add User"**

## Step 4: Configure Network Access

1. Click on **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, add only specific IP addresses
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select:
   - Driver: **Node.js**
   - Version: **5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Configure Connection String

1. Replace `<username>` with your database username
2. Replace `<password>` with your database password
3. Add database name after `.net/`:
   ```
   mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/tuition_management?retryWrites=true&w=majority
   ```

## Step 7: Update Backend .env File

1. Open `backend/.env` file
2. Replace the MONGODB_URI with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/tuition_management?retryWrites=true&w=majority
   ```

## Step 8: Test Connection

1. Start your backend server:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. You should see:
   ```
   MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
   Server is running on port 5000
   ```

## Collections Created Automatically

When you run the application, MongoDB will automatically create these collections:

1. **users** - Stores admin and student data
2. **exams** - Stores exam records

## Creating First Admin User

You can create an admin user in two ways:

### Method 1: Using API (Postman/Thunder Client)

POST request to `http://localhost:5000/api/auth/register`:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "phone": "1234567890",
  "address": "Admin Address",
  "role": "admin"
}
```

### Method 2: Using MongoDB Compass or Atlas UI

1. Connect to your database using MongoDB Compass
2. Create a document in the `users` collection:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$hashed_password_here",
  "phone": "1234567890",
  "address": "Admin Address",
  "class": "",
  "photo": "https://via.placeholder.com/150",
  "role": "admin"
}
```

**Note:** For Method 2, you need to hash the password first using bcrypt.

## Monitoring Your Database

1. Go to MongoDB Atlas Dashboard
2. Click on your cluster
3. Click **"Browse Collections"** to view your data
4. Monitor metrics under **"Metrics"** tab

## Best Practices

✅ **Never commit** your `.env` file to version control
✅ Use **strong passwords** for database users
✅ Enable **IP whitelisting** for production
✅ Regularly **backup** your database
✅ Monitor **database usage** to stay within free tier limits

## Free Tier Limits

MongoDB Atlas Free Tier (M0) includes:

- 512 MB storage
- Shared RAM
- Shared vCPU
- No backup capability
- Perfect for development and learning

## Troubleshooting

### Connection Error
- Check if IP address is whitelisted
- Verify username and password
- Ensure connection string is correct

### Authentication Failed
- Verify database user credentials
- Check if user has proper permissions

### Network Timeout
- Check your internet connection
- Verify firewall settings
- Try different network

## Support

For more help:
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Community Forums](https://community.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/) - Free courses

---

**You're all set! 🎉**

Your MongoDB Atlas database is now ready for the Tuition Management System.
