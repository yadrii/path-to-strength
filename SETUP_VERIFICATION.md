# ✅ Setup Verification Checklist

Before you start the servers, verify everything is in place:

---

## 📦 Backend Verification

### Files Created

- [ ] `Backend/src/config/database.ts` ✅
- [ ] `Backend/src/models/User.ts` ✅
- [ ] `Backend/src/routes/authRoutes.ts` ✅
- [ ] `Backend/src/utils/auth.ts` ✅
- [ ] `Backend/src/middleware/authMiddleware.ts` (updated) ✅
- [ ] `Backend/src/index.ts` (updated) ✅
- [ ] `Backend/.env.example` ✅

### Environment & Config

- [ ] Create `Backend/.env` from `.env.example`
- [ ] `MONGODB_URI` set correctly
- [ ] `JWT_SECRET` is at least 32 characters
- [ ] `JWT_REFRESH_SECRET` is at least 32 characters
- [ ] `FIREBASE_PROJECT_ID` set
- [ ] `FIREBASE_STORAGE_BUCKET` set
- [ ] `FRONTEND_URL` set to `http://localhost:5173`

### Firebase Setup

- [ ] Created Firebase project
- [ ] Downloaded `serviceAccountKey.json`
- [ ] Placed in `Backend/src/serviceAccountKey.json`
- [ ] Added `serviceAccountKey.json` to `.gitignore`
- [ ] Email/Password auth enabled in Firebase Console

### Database

- [ ] MongoDB installed OR MongoDB Atlas account created
- [ ] MongoDB connection string validated

  ```bash
  # Test local connection
  mongo

  # Or test Atlas connection
  # Copy your connection string and test in a MongoDB client
  ```

### Dependencies

- [ ] Run `npm install` in Backend directory
- [ ] Check `package.json` has:
  - express
  - mongoose
  - firebase-admin
  - bcryptjs
  - jsonwebtoken
  - cors
  - dotenv

### Try Starting

```bash
cd Backend
npm run dev

# Should show:
# ✅ Server running on http://localhost:5000
# ✅ MongoDB connected successfully
```

---

## 🎨 Frontend Verification

### Files Created

- [ ] `Frontend/src/services/apiClient.ts` ✅
- [ ] `Frontend/src/contexts/AuthContext.tsx` (updated) ✅
- [ ] `Frontend/src/config/firebase.ts` ✅
- [ ] `Frontend/src/pages/AuthPage.tsx` (updated) ✅
- [ ] `Frontend/src/components/PrivateRoute.tsx` ✅
- [ ] `Frontend/src/App.tsx` (updated) ✅
- [ ] `Frontend/.env.example` ✅

### Environment & Config

- [ ] Create `Frontend/.env` from `.env.example`
- [ ] `VITE_BACKEND_URL` set to `http://localhost:5000/api`
- [ ] All `VITE_FIREBASE_*` variables set from Firebase Console

### Firebase Setup

- [ ] Created Firebase app in project
- [ ] Copied web SDK config from Firebase Console
- [ ] All 6 Firebase variables in `.env`:
  - VITE_FIREBASE_API_KEY
  - VITE_FIREBASE_AUTH_DOMAIN
  - VITE_FIREBASE_PROJECT_ID
  - VITE_FIREBASE_STORAGE_BUCKET
  - VITE_FIREBASE_MESSAGING_SENDER_ID
  - VITE_FIREBASE_APP_ID

### Dependencies

- [ ] Run `npm install` in Frontend directory
- [ ] Check `package.json` has firebase dependency
  - firebase (^12.11.0 or newer)

### Try Starting

```bash
cd Frontend
npm run dev

# Should show:
# ✅ Local: http://localhost:5173/
```

---

## 🧪 Functionality Tests

### Backend API Tests

Run these commands to verify backend works:

#### Test 1: Server is running

```bash
curl http://localhost:5000/

# Should return:
# {"message":"🚀 Sahara Backend API is running"}
```

#### Test 2: Register endpoint exists

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456",
    "role": "user"
  }'

# Should return success with tokens
```

#### Test 3: Login endpoint works

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'

# Should return success with tokens
```

### Frontend UI Tests

1. [ ] Open http://localhost:5173
2. [ ] Click Auth page
3. [ ] See both Login and Sign Up tabs
4. [ ] Try signing up with test credentials
5. [ ] Should redirect to `/dashboard`
6. [ ] See user info displayed

---

## 🔓 Common Verification Steps

### Check Backend is Running

```bash
# In Backend directory
npm run dev

# Look for:
✅ Server running on http://localhost:5000
✅ MongoDB connected successfully
```

### Check Frontend is Running

```bash
# In Frontend directory
npm run dev

# Look for:
✅ Local: http://localhost:5173/
Ready in ...ms
```

### Verify Environment Variables

```bash
# Backend
echo $MONGODB_URI
echo $JWT_SECRET

# Frontend (in .env file, not echo)
cat .env | grep VITE_
```

### Check MongoDB Connection

```bash
# If using local MongoDB
mongosh --eval "db.adminCommand('ping')"

# If using Atlas, test with MongoDB Compass
# or command line connection string
```

### Verify Firebase Setup

1. Go to Firebase Console
2. Select your project
3. Under Authentication → Users
   - Should see test user after signup
4. Under Project Settings → Apps
   - Should see your web app
   - Config should match your `.env`

---

## 📝 Pre-flight Checklist

Before declaring "Done":

- [ ] Backend `.env` created with all variables
- [ ] Frontend `.env` created with all variables
- [ ] `serviceAccountKey.json` in `Backend/src/`
- [ ] Both added to `.gitignore`
- [ ] MongoDB is accessible
- [ ] Firebase project created with Email auth enabled
- [ ] `npm install` run in both directories
- [ ] `npm run dev` works in both directories
- [ ] Can see signup form at http://localhost:5173/auth
- [ ] Can create account successfully
- [ ] Can login with created account
- [ ] Can see user info in protected `/dashboard` route
- [ ] All API endpoints responding (see API_REFERENCE.md)

---

## 🚨 If Something Isn't Working

### Backend won't start?

```bash
# Check error message for:
# - Port 5000 already in use → kill process or change PORT in .env
# - MongoDB connection failed → check MONGODB_URI in .env
# - serviceAccountKey.json not found → check file location
# - Missing environment variables → check .env file
```

### Frontend won't start?

```bash
# The error usually tells you what's wrong:
# - Port 5173 in use → change port
# - Module not found → run npm install again
# - .env not found → create from .env.example
```

### API calls failing?

```bash
# Check:
# 1. Backend is running (http://localhost:5000)
# 2. VITE_BACKEND_URL in Frontend/.env is correct
# 3. CORS is enabled (default: yes)
# 4. No typos in environment variables
```

### Database connection failing?

```bash
# For local MongoDB:
mongosh  # Should connect successfully

# For MongoDB Atlas:
# Copy connection string from Atlas
# Test in MongoDB Compass
# Update MONGODB_URI in .env
```

### Firebase auth failing?

```bash
# Check:
# 1. Email/Password auth enabled in Firebase Console
# 2. serviceAccountKey.json is valid
# 3. FIREBASE_PROJECT_ID matches your Firebase project
# 4. Website domain added to Firebase Auth (if needed)
```

---

## ✨ You're Ready When:

✅ Both servers running without errors  
✅ Frontend loads at http://localhost:5173  
✅ Can see auth page with login/signup forms  
✅ Can create account successfully  
✅ Can login with created credentials  
✅ Protected routes redirect properly  
✅ All API endpoints in API_REFERENCE.md work

---

## 🎉 Congratulations!

Your complete authentication system is ready!

**Next Steps:**

1. Read QUICK_START_CHECKLIST.md for first-time setup
2. Read AUTHENTICATION_SETUP_GUIDE.md for detailed information
3. Refer to API_REFERENCE.md for endpoint documentation
4. Start building features on top of auth!

---

**If you encounter issues → Check the error message → Search in guides above → Ask for help**
