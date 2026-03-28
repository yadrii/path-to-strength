# 🚀 Quick Start Checklist - Complete Auth Setup

## Step 1: Firebase Setup (5 mins)

- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create new project or select existing
- [ ] Enable **Authentication** → **Email/Password**
- [ ] Download `serviceAccountKey.json`
- [ ] Place in `Backend/src/serviceAccountKey.json`
- [ ] Add to `.gitignore` (critical!)

**Get Firebase Config:**

- [ ] Go to **Project Settings** → **Your apps** → Copy web config
- [ ] This gives you API key, auth domain, project ID, etc.

---

## Step 2: Database Setup (5 mins)

### Option A: Local MongoDB

```bash
# macOS
brew tap mongodb/brew && brew install mongodb-community
brew services start mongodb-community

# Windows: Download from https://www.mongodb.com/try/download/community
# Linux: https://docs.mongodb.com/manual/administration/install-on-linux/
```

### Option B: MongoDB Atlas (Cloud)

- [ ] Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create free cluster
- [ ] Get connection string

---

## Step 3: Backend Environment (2 mins)

Create `Backend/.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/sahara
JWT_SECRET=your-super-secret-jwt-key-min-32-char-long
JWT_REFRESH_SECRET=your-super-secret-refresh-min-32-char-long
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-bucket.appspot.com
```

**Generate Secrets:**

```bash
# macOS/Linux
openssl rand -base64 32
openssl rand -base64 32

# Use these values for JWT secrets!
```

---

## Step 4: Frontend Environment (2 mins)

Create `Frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

---

## Step 5: Start Servers (2 mins)

### Terminal 1 - Backend

```bash
cd Backend
npm run dev
# Should show: ✅ Server running on http://localhost:5000
# And:        ✅ MongoDB connected successfully
```

### Terminal 2 - Frontend

```bash
cd Frontend
npm run dev
# Should show: ✅ VITE v... ready in ... ms
# Access at: http://localhost:5173
```

---

## Step 6: Test Authentication (5 mins)

### Go to Frontend and Test:

1. **Sign Up**
   - Go to http://localhost:5173/auth
   - Click "Sign Up"
   - Fill in details as "User" role
   - Click "Create Account"
   - Should redirect to `/dashboard`

2. **Check Console**
   - You should see user object in console
   - Token stored in localStorage

3. **Login**
   - Go to http://localhost:5173/auth
   - Click "Login"
   - Use credentials from signup
   - Should redirect to `/dashboard`

4. **Test Protected Route**
   - Manually go to `/dashboard`
   - If logged in → see dashboard
   - If logged out → redirect to `/auth`

---

## 📡 API Testing (Using Postman/cURL)

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "test123456",
    "role": "user"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "test123456"
  }'
```

Response should include:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJ0eXAi...",
    "refreshToken": "eyJ0eXAi..."
  }
}
```

### Get Current User

```bash
# Replace TOKEN with actual accessToken from login
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## ✅ Implementation Checklist

### Backend ✅

- [x] MongoDB connection setup
- [x] User model with all fields
- [x] Password hashing (bcrypt)
- [x] JWT token generation
- [x] Auth routes (register, login, logout, etc.)
- [x] Token verification middleware
- [x] Error handling
- [x] Email verification endpoint
- [x] Password reset endpoints
- [x] Profile update endpoint

### Frontend ✅

- [x] AuthContext with API integration
- [x] API client with token management
- [x] Complete login/signup UI
- [x] Form validation
- [x] Error messages
- [x] Protected routes
- [x] Token storage & retrieval
- [x] Auto-logout on token expiry

---

## 🔐 Security Checklist

- [x] Passwords hashed with bcrypt
- [x] JWT tokens with expiry
- [x] Refresh token mechanism
- [x] CORS configured
- [x] Environment variables for secrets
- [x] Input validation on endpoints

**Still to implement:**

- [ ] Email verification for signup
- [ ] Password reset email link
- [ ] Rate limiting on auth endpoints
- [ ] 2FA (Two-Factor Authentication)
- [ ] OAuth (Google, Apple login)
- [ ] Audit logging

---

## 📁 What Was Created

### Backend Files

```
Backend/
├── src/
│   ├── config/database.ts              ✅ MongoDB connection
│   ├── models/User.ts                  ✅ Enhanced User model
│   ├── routes/authRoutes.ts            ✅ All auth endpoints
│   ├── middleware/authMiddleware.ts    ✅ Updated JWT verification
│   ├── utils/auth.ts                   ✅ Password hashing, crypto
│   └── index.ts                        ✅ Updated with MongoDB & routes
├── .env.example                        ✅ Environment template
└── package.json                        ✅ Updated dependencies
```

### Frontend Files

```
Frontend/
├── src/
│   ├── services/apiClient.ts           ✅ API client with auth
│   ├── contexts/AuthContext.tsx        ✅ Updated with API calls
│   ├── config/firebase.ts              ✅ Firebase initialization
│   ├── pages/AuthPage.tsx              ✅ New comprehensive login/signup
│   ├── components/PrivateRoute.tsx     ✅ Protected route wrapper
│   └── App.tsx                         ✅ Updated routes
└── .env.example                        ✅ Firebase config template
```

### Documentation

```
/
├── AUTHENTICATION_SETUP_GUIDE.md       ✅ Complete guide
└── QUICK_START_CHECKLIST.md            ✅ This file
```

---

## 🆘 Common Issues & Solutions

### "Cannot find serviceAccountKey.json"

```
✗ Wrong: Backend/serviceAccountKey.json
✅ Correct: Backend/src/serviceAccountKey.json
```

### "CORS error: Access blocked"

- Check `FRONTEND_URL` in Backend `.env`
- Restart backend after changing

### "MongoDB connection refused"

```bash
# Check if MongoDB is running
mongo
# Should connect successfully

# Or start MongoDB
brew services start mongodb-community
```

### "Firebase auth failed"

- Verify email/password auth enabled in Firebase Console
- Check serviceAccountKey.json is valid
- Restart backend

### "Tokens not persisting"

- Check localStorage in browser DevTools
- Clear cache and try again
- Check if token API call succeeded

---

## 🎯 Next Steps

After initial setup works:

1. **Test NGO role**
   - Sign up as NGO
   - Should see NGO dashboard at `/ngo-dashboard`

2. **Implement email verification**
   - Uncomment email sending code
   - Setup SMTP configuration

3. **Add password reset flow**
   - Frontend page at `/forgot-password`
   - Test with email link

4. **Move to production**
   - Switch MongoDB to Supabase
   - Deploy backend (Heroku, Railway, Render)
   - Deploy frontend (Vercel, Netlify)
   - Update environment variables

5. **Enhanced security**
   - Add rate limiting
   - Add email verification requirement
   - Add 2FA
   - Add OAuth logins

---

## 📞 Need Help?

**Backend not starting?**

- Check port 5000 not in use: `lsof -i :5000`
- Check MongoDB connection string in `.env`
- Check firebaseAccountKey.json exists

**Frontend auth not working?**

- Check `VITE_BACKEND_URL` in `.env`
- Check backend API is running
- Open DevTools > Network tab → check auth requests
- Check browser console for errors

**Database issues?**

- MongoDB: `mongo --version` to check installation
- Check connection string format
- Try local connection first before cloud

---

**🎉 Everything is now set up! Start with Step 1 above and follow the checklist.**
