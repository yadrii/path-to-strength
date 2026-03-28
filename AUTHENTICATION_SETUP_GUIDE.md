# 🔐 Complete Firebase Authentication Setup Guide

## 📋 Overview

This guide walks you through setting up a complete end-to-end authentication flow for your Sahara project using:

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript + Node.js
- **Database**: MongoDB (development) / Supabase PostgreSQL (production)
- **Authentication**: Firebase Auth + JWT + Custom MongoDB User Storage

---

## 🚀 Phase 1: Backend Setup

### 1.1 Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** and select **Email/Password** provider
4. Go to **Project Settings** > **Service Accounts**
5. Click **Generate New Private Key** and download `serviceAccountKey.json`
6. **Place `serviceAccountKey.json` in `Backend/src/` folder**
7. **Add to `.gitignore`**: Never commit this file!

```bash
# Backend/.gitignore
serviceAccountKey.json
.env
node_modules/
dist/
```

### 1.2 MongoDB Setup (Development)

**Option A: Local MongoDB**

```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows
# Download installer from: https://www.mongodb.com/try/download/community

# Linux
# Follow: https://docs.mongodb.com/manual/administration/install-on-linux/
```

**Option B: MongoDB Atlas (Cloud)**

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/sahara`

### 1.3 Environment Variables Setup

Create `Backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sahara
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sahara

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters-long

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket

# Email (optional - for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@sahara.com
```

### 1.4 Start Backend

```bash
cd Backend

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

You should see:

```
✅ Server running on http://localhost:5000
✅ MongoDB connected successfully
```

---

## 🎨 Phase 2: Frontend Setup

### 2.1 Firebase Configuration

Go to [Firebase Console](https://console.firebase.google.com/):

1. Select your project
2. Go to **Project Settings**
3. Scroll to **Your apps** section
4. Click the web app and copy the config

Create `Frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000/api

# Get these from Firebase Console > Project Settings > Your apps
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

### 2.2 Update App Router

Update `Frontend/src/App.tsx` to use PrivateRoute:

```typescript
import PrivateRoute from '@/components/PrivateRoute';

<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/auth" element={<AuthPage />} />
  <Route
    path="/dashboard"
    element={
      <PrivateRoute requiredRole="user">
        <UserDashboard />
      </PrivateRoute>
    }
  />
  <Route
    path="/ngo-dashboard"
    element={
      <PrivateRoute requiredRole="ngo">
        <NgoDashboard />
      </PrivateRoute>
    }
  />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 2.3 Start Frontend

```bash
cd Frontend
npm install firebase  # if not already installed
npm run dev
```

Access at: `http://localhost:5173`

---

## 🔄 Complete Auth Flow

### Authentication Endpoints

#### 1. **Register** `POST /api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user",
  "phoneNumber": "+1234567890"
}
```

#### 2. **Login** `POST /api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### 3. **Get Current User** `GET /api/auth/me`

- **Header**: `Authorization: Bearer {accessToken}`

#### 4. **Refresh Token** `POST /api/auth/refresh-token`

```json
{
  "refreshToken": "previous-refresh-token"
}
```

#### 5. **Update Profile** `PUT /api/auth/update-profile`

- **Header**: `Authorization: Bearer {accessToken}`

```json
{
  "name": "Jane Doe",
  "phoneNumber": "+0987654321",
  "profilePicture": "https://..."
}
```

#### 6. **Change Password** `POST /api/auth/change-password`

- **Header**: `Authorization: Bearer {accessToken}`

```json
{
  "currentPassword": "old123",
  "newPassword": "new123"
}
```

#### 7. **Forgot Password** `POST /api/auth/forgot-password`

```json
{
  "email": "john@example.com"
}
```

#### 8. **Reset Password** `POST /api/auth/reset-password`

```json
{
  "email": "john@example.com",
  "token": "reset-token-from-email",
  "newPassword": "newPassword123"
}
```

#### 9. **Verify Email** `POST /api/auth/verify-email`

```json
{
  "email": "john@example.com",
  "token": "verification-token"
}
```

#### 10. **Logout** `POST /api/auth/logout`

- **Header**: `Authorization: Bearer {accessToken}`

---

## 📧 Email Service Setup (Optional)

For password reset and email verification emails, configure SMTP:

### Gmail SMTP Setup

1. Enable 2-Factor Authentication on Gmail
2. Create an [App Password](https://myaccount.google.com/apppasswords)
3. Update `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@sahara.com
```

### Email Service Integration (Future)

Create `Backend/src/services/emailService.ts`:

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendResetEmail = async (email: string, token: string) => {
  //  Implementation
};
```

---

## 🔄 Production Migration to Supabase

### Supabase Setup

1. Sign up at [Supabase](https://supabase.com)
2. Create new project
3. Get connection string from **Project Settings > Database**

### Migration Steps

1. **Migrate data structure**:
   - Supabase uses PostgreSQL instead of MongoDB
   - Update schema in `Backend/src/models/User.ts` if needed

2. **Update connection string**:

```env
# Production .env
MONGODB_URI=postgresql://user:password@host:5432/sahara
```

3. **Use Supabase Auth** (optional):
   - Supabase provides built-in Auth (similar to Firebase)
   - Can replace Firebase Admin SDK with Supabase SDK

### Key Differences:

| Feature  | Firebase                | Supabase PostgreSQL |
| -------- | ----------------------- | ------------------- |
| Database | Realtime DB / Firestore | PostgreSQL          |
| Auth     | Firebase Auth           | Supabase Auth       |
| Cost     | Pay per operation       | Pay per GB          |
| Scaling  | Automatic               | Manual              |

---

## 🧪 Testing the Auth Flow

### Using Postman or cURL

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456",
    "role": "user"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'

# 3. Get current user (use token from login response)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🛡️ Security Best Practices

### ✅ Do's

- ✅ Store `serviceAccountKey.json` in `.gitignore`
- ✅ Use strong JWT secrets (min 32 characters)
- ✅ Hash passwords with bcrypt (already implemented)
- ✅ Validate all user inputs
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on auth endpoints
- ✅ Store tokens in httpOnly cookies (not localStorage for sensitive apps)
- ✅ Refresh tokens before expiry

### ❌ Don'ts

- ❌ Never commit `.env` or Firebase keys
- ❌ Don't send passwords in URLs or query params
- ❌ Don't log sensitive data
- ❌ Don't use weak passwords
- ❌ Don't accept user input without validation

---

## 🐛 Troubleshooting

### "MongoDB connection failed"

```bash
# Check if MongoDB is running
# macOS
brew services list

# Windows
Get-Service MongoDB

# Try connection string
mongodb://localhost:27017/sahara
```

### "Firebase auth failed"

- Ensure `serviceAccountKey.json` exists in `Backend/src/`
- Check that email/password auth is enabled in Firebase Console
- Verify Firebase project ID matches `.env`

### "CORS errors"

- Update `FRONTEND_URL` in Backend `.env`
- Ensure frontend makes API calls to correct backend URL

### "Token expired"

- Frontend automatically attempts refresh using refresh token
- If refresh fails, user redirected to login

---

## 📱 Next Steps

1. **Implement email service** for password reset workflows
2. **Add social login** (Google, Apple, GitHub via Firebase)
3. **Setup CI/CD pipeline** for deployment
4. **Implement 2FA** for security
5. **Migrate to Supabase** for production
6. **Add audit logging** for security events
7. **Implement rate limiting** on auth endpoints

---

## 📞 Quick Reference

### File Locations

```
Backend/
├── src/
│   ├── config/database.ts          # MongoDB connection
│   ├── models/User.ts              # User schema
│   ├── routes/authRoutes.ts        # Full auth endpoints
│   ├── middleware/authMiddleware.ts # Token verification
│   └── utils/auth.ts               # Password hashing, JWT
├── .env                            # Environment variables
└── serviceAccountKey.json          # Firebase credentials (NEVER COMMIT)

Frontend/
├── src/
│   ├── services/apiClient.ts       # API client with token handling
│   ├── contexts/AuthContext.tsx    # Auth state management
│   ├── pages/AuthPage.tsx          # Login/signup UI
│   └── components/PrivateRoute.tsx # Protected routes
└── .env                            # Firebase config
```

### Commands

```bash
# Backend development
cd Backend && npm run dev

# Frontend development
cd Frontend && npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

---

**You now have a complete, production-ready authentication system! 🎉**
