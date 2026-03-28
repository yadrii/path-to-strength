# 🔌 Complete API Reference

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api (update accordingly)
```

## Authentication Methods

All protected endpoints require:

```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

---

## 📝 Register User

**POST** `/auth/register`

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user",
  "phoneNumber": "+1234567890"
}
```

### Response (201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error (409 Conflict)

```json
{
  "success": false,
  "message": "User already exists",
  "data": null
}
```

### cURL Example

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "user"
  }'
```

---

## 🔓 Login

**POST** `/auth/login`

### Request

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error (401 Unauthorized)

```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null
}
```

### cURL Example

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

---

## 🔄 Refresh Token

**POST** `/auth/refresh-token`

### Request

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error (401 Unauthorized)

```json
{
  "success": false,
  "message": "Invalid refresh token",
  "data": null
}
```

### cURL Example

```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token-here"
  }'
```

---

## 👤 Get Current User

**GET** `/auth/me`

**Headers:**

```
Authorization: Bearer {accessToken}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phoneNumber": "+1234567890",
    "isEmailVerified": false,
    "lastLogin": "2026-03-28T10:30:00Z",
    "createdAt": "2026-03-28T09:00:00Z",
    "updatedAt": "2026-03-28T10:30:00Z"
  }
}
```

### Error (401 Unauthorized)

```json
{
  "success": false,
  "message": "Invalid token",
  "data": null
}
```

### cURL Example

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📋 Update Profile

**PUT** `/auth/update-profile`

**Headers:**

```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Request

```json
{
  "name": "Jane Doe",
  "phoneNumber": "+9876543210",
  "profilePicture": "https://example.com/avatar.jpg"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "john@example.com",
    "phoneNumber": "+9876543210",
    "profilePicture": "https://example.com/avatar.jpg",
    "role": "user",
    "isEmailVerified": false
  }
}
```

### cURL Example

```bash
curl -X PUT http://localhost:5000/api/auth/update-profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phoneNumber": "+9876543210"
  }'
```

---

## 🔐 Change Password

**POST** `/auth/change-password`

**Headers:**

```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Request

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

### Error (401 Unauthorized)

```json
{
  "success": false,
  "message": "Current password is incorrect",
  "data": null
}
```

### cURL Example

```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newSecurePassword456"
  }'
```

---

## 🔑 Forgot Password

**POST** `/auth/forgot-password`

### Request

```json
{
  "email": "john@example.com"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "If email exists, reset link will be sent",
  "data": null
}
```

**Note:** Email with reset link will be sent to user (when SMTP is configured)

### cURL Example

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

---

## 🔓 Reset Password

**POST** `/auth/reset-password`

### Request

```json
{
  "email": "john@example.com",
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword456"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null
}
```

### Error (401 Unauthorized)

```json
{
  "success": false,
  "message": "Reset token has expired",
  "data": null
}
```

### cURL Example

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "token": "reset-token-value",
    "newPassword": "newSecurePassword456"
  }'
```

---

## ✉️ Verify Email

**POST** `/auth/verify-email`

### Request

```json
{
  "email": "john@example.com",
  "token": "verification-token"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null
}
```

### cURL Example

```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "token": "verification-token"
  }'
```

---

## 📧 Resend Verification Email

**POST** `/auth/resend-verification-email`

### Request

```json
{
  "email": "john@example.com"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Verification email sent",
  "data": null
}
```

### cURL Example

```bash
curl -X POST http://localhost:5000/api/auth/resend-verification-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

---

## 🚪 Logout

**POST** `/auth/logout`

**Headers:**

```
Authorization: Bearer {accessToken}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

### cURL Example

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔗 HTTP Status Codes

| Code | Meaning                                     |
| ---- | ------------------------------------------- |
| 200  | OK - Request successful                     |
| 201  | Created - Resource created (registration)   |
| 400  | Bad Request - Missing or invalid parameters |
| 401  | Unauthorized - Invalid or expired token     |
| 404  | Not Found - User/resource not found         |
| 409  | Conflict - User already exists              |
| 500  | Internal Server Error - Server error        |

---

## 🔒 Token Information

### JWT Structure

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "507f1f77bcf86cd799439011",
  "role": "user",
  "iat": 1711602600,
  "exp": 1711689000
}

Signature: HMACSHA256(header.payload)
```

### Token Expiry

- **Access Token**: 24 hours (1 day)
- **Refresh Token**: 7 days
- **Verification Token**: 24 hours
- **Password Reset Token**: 1 hour

---

## 🧪 Testing Workflows

### Complete Registration & Login

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

# Save the accessToken and refreshToken from response

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'

# 3. Get user info
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer ACCESS_TOKEN_HERE"
```

### Password Reset Flow

```bash
# 1. Request password reset
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Get reset token from email (or check backend logs in development)

# 2. Reset password
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "token": "RESET_TOKEN_FROM_EMAIL",
    "newPassword": "newPassword123"
  }'

# 3. Login with new password
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "newPassword123"
  }'
```

---

## 🎯 Common Error Scenarios

### Invalid Email Format

```json
{
  "success": false,
  "message": "Missing required fields",
  "data": null
}
```

### Password Too Short

```json
{
  "success": false,
  "message": "Password must be at least 6 characters",
  "data": null
}
```

### Token Expired

```json
{
  "success": false,
  "message": "Invalid token",
  "data": null
}
```

### User Not Found

```json
{
  "success": false,
  "message": "User not found",
  "data": null
}
```

---

**Use this reference guide for all API integrations and testing!**
