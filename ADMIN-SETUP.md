# Admin Setup Guide

## Problem Identified

The admin login was not working because **the admin user does not exist in the database**. While the login UI suggests using `admin@example.com` / `password123`, this user was never seeded into the MongoDB database.

### Root Cause

According to the PROJECT-STATUS.md:
- ✅ Backend models created (including User model with bcrypt authentication)
- ❌ Authentication controllers NOT implemented
- ❌ API routes NOT implemented  
- ❌ Seeding scripts NOT created

The authentication endpoints (`/api/auth/login` and `/api/auth/register`) return 404 errors, indicating they are not implemented in the running backend server.

## Solution

A seed script (`backend/seedAdmin.js`) has been created to add the admin user to the database.

## How to Enable Admin Login

### Method 1: Run the Seed Script (Recommended)

1. **Open your GitHub Codespace terminal**

2. **Navigate to the backend directory:**
   ```bash
   cd /workspaces/mern-ecommerce-app/backend
   ```

3. **Run the seed script:**
   ```bash
   node seedAdmin.js
   ```

4. **Expected output:**
   ```
   MongoDB Connected
   Admin user created successfully
   Email: admin@example.com
   Password: password123
   ```

5. **Now you can log in at the frontend with:**
   - **Email:** `admin@example.com`
   - **Password:** `password123`

### Method 2: Add to package.json Scripts

Add this to your `backend/package.json` scripts section:

```json
"scripts": {
  "seed:admin": "node seedAdmin.js"
}
```

Then run:
```bash
npm run seed:admin
```

## Admin Credentials

**Email:** admin@example.com  
**Password:** password123  
**Role:** admin

⚠️ **Important:** Change these credentials in production!

## What the Seed Script Does

1. Connects to your MongoDB database
2. Checks if admin user already exists (prevents duplicates)
3. Hashes the password using bcrypt
4. Creates the admin user with role='admin'
5. Saves to database

## Next Steps

After seeding the admin user, you still need to:

1. **Implement authentication controllers** in `backend/controllers/authController.js`
2. **Create API routes** in `backend/routes/authRoutes.js`
3. **Implement JWT middleware** for protected routes
4. **Connect frontend to backend** authentication endpoints

## Troubleshooting

### "Admin user already exists"
This means the script has already been run. The admin user is in the database.

### "MongoDB connection failed"
Check that:
- Your MongoDB is running
- `MONGO_URI` in `.env` is correct
- Network connectivity is working

### "Cannot find module"
Make sure you're in the `/workspaces/mern-ecommerce-app/backend` directory and all dependencies are installed:
```bash
npm install
```

## Security Notes

- The password is hashed with bcrypt (salt rounds: 10)
- Never commit real passwords to version control  
- Change default credentials in production
- Use environment variables for sensitive data
