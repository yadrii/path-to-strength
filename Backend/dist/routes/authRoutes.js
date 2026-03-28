import express from "express";
import admin from "firebase-admin";
import { User } from "../models/User";
import { hashPassword, comparePasswords, generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, generateVerificationToken, generatePasswordResetToken, } from "../utils/auth";
import verifyToken from "../middleware/authMiddleware";
const router = express.Router();
// Helper to send consistent responses
const sendError = (res, status, message) => {
    return res.status(status).json({ success: false, message, data: null });
};
const sendSuccess = (res, status, message, data) => {
    return res.status(status).json({ success: true, message, data });
};
// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, phoneNumber } = req.body;
        // Validation
        if (!name || !email || !password || !role) {
            return sendError(res, 400, "Missing required fields");
        }
        if (!["user", "ngo"].includes(role)) {
            return sendError(res, 400, "Invalid role. Must be 'user' or 'ngo'");
        }
        // Check if user already exists in MongoDB
        let user = await User.findOne({ email });
        if (user) {
            return sendError(res, 409, "User already exists");
        }
        // Hash password
        const hashedPassword = await hashPassword(password);
        // Create user in MongoDB
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phoneNumber,
            isEmailVerified: false,
        });
        await user.save();
        // Create Firebase Auth user
        let firebaseUser;
        try {
            firebaseUser = await admin.auth().createUser({
                email,
                password,
                displayName: name,
            });
            user.firebaseUid = firebaseUser.uid;
            await user.save();
        }
        catch (firebaseError) {
            // If Firebase fails but MongoDB user exists, delete from MongoDB
            await User.deleteOne({ email });
            return sendError(res, 500, `Firebase registration failed: ${firebaseError.message}`);
        }
        // Generate tokens
        const accessToken = generateAccessToken(user._id.toString(), role);
        const refreshToken = generateRefreshToken(user._id.toString());
        return sendSuccess(res, 201, "User registered successfully", {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
            },
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        console.error("Register error:", error);
        return sendError(res, 500, error.message);
    }
});
// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendError(res, 400, "Email and password are required");
        }
        // Find user in MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, 401, "Invalid credentials");
        }
        // Compare passwords
        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) {
            return sendError(res, 401, "Invalid credentials");
        }
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        // Generate tokens
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshToken = generateRefreshToken(user._id.toString());
        return sendSuccess(res, 200, "Login successful", {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
            },
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return sendError(res, 500, error.message);
    }
});
// ==================== REFRESH TOKEN ====================
router.post("/refresh-token", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return sendError(res, 400, "Refresh token is required");
        }
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return sendError(res, 401, "Invalid refresh token");
        }
        const user = await User.findById(decoded.userId);
        if (!user) {
            return sendError(res, 404, "User not found");
        }
        const newAccessToken = generateAccessToken(user._id.toString(), user.role);
        return sendSuccess(res, 200, "Token refreshed successfully", {
            accessToken: newAccessToken,
        });
    }
    catch (error) {
        console.error("Refresh token error:", error);
        return sendError(res, 500, error.message);
    }
});
// ==================== GET CURRENT USER ====================
router.get("/me", verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return sendError(res, 404, "User not found");
        }
        return sendSuccess(res, 200, "User fetched successfully", user);
    }
    catch (error) {
        console.error("Get user error:", error);
        return sendError(res, 500, error.message);
    }
});
// ==================== LOGOUT ====================
router.post("/logout", verifyToken, async (req, res) => {
    try {
        // In production, you might want to invalidate tokens in Redis or similar
        return sendSuccess(res, 200, "Logout successful");
    }
    catch (error) {
        console.error("Logout error:", error);
        return sendError(res, 500, error.message);
    }
});
// ==================== UPDATE PROFILE ====================
router.put("/update-profile", verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, phoneNumber, profilePicture } = req.body;
        const user = await User.findByIdAndUpdate(userId, { name, phoneNumber, profilePicture }, { new: true, runValidators: true }).select("-password");
        if (!user) {
            return sendError(res, 404, "User not found");
        }
        return sendSuccess(res, 200, "Profile updated successfully", user);
    }
    catch (error) {
        console.error("Update profile error:", error);
        return sendError(res, 500, error.message);
    }
});
// ==================== LIST USER ACCOUNTS (NGO ONLY) ====================
router.get("/users", verifyToken, async (req, res) => {
    try {
        const requester = req.user;
        if (!requester || requester.role !== "ngo") {
            return sendError(res, 403, "Access denied");
        }
        const users = await User.find({ role: "user" }).select("_id name email role phoneNumber isEmailVerified lastLogin");
        return sendSuccess(res, 200, "Users fetched successfully", users);
    }
    catch (error) {
        console.error("Get users error:", error);
        return sendError(res, 500, error.message);
    }
});
router.get("/users/:id", verifyToken, async (req, res) => {
    try {
        const requester = req.user;
        if (!requester || requester.role !== "ngo") {
            return sendError(res, 403, "Access denied");
        }
        const user = await User.findById(req.params.id).select("_id name email role phoneNumber isEmailVerified lastLogin");
        if (!user) {
            return sendError(res, 404, "User not found");
        }
        return sendSuccess(res, 200, "User fetched successfully", user);
    }
    catch (error) {
        console.error("Get user error:", error);
        return sendError(res, 500, error.message);
    }
});
// ==================== CHANGE PASSWORD ====================
router.post("/change-password", verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return sendError(res, 400, "Current and new passwords are required");
        }
        const user = await User.findById(userId);
        if (!user) {
            return sendError(res, 404, "User not found");
        }
        const isPasswordValid = await comparePasswords(currentPassword, user.password);
        if (!isPasswordValid) {
            return sendError(res, 401, "Current password is incorrect");
        }
        user.password = await hashPassword(newPassword);
        await user.save();
        return sendSuccess(res, 200, "Password changed successfully");
    }
    catch (error) {
        console.error("Change password error:", error);
        return sendError(res, 500, error.message);
    }
});
// ==================== FORGOT PASSWORD ====================
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return sendError(res, 400, "Email is required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not for security
            return sendSuccess(res, 200, "If email exists, reset link will be sent");
        }
        const resetToken = generatePasswordResetToken();
        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        await user.save();
        // TODO: Send email with reset link
        // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
        // await sendEmail(email, "Password Reset", `Click here to reset: ${resetLink}`);
        console.log(`\n📧 Password reset token for ${email}: ${resetToken}`);
        console.log(`   Reset link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}\n`);
        return sendSuccess(res, 200, "If email exists, reset link will be sent");
    }
    catch (error) {
        console.error("Forgot password error:", error);
        return sendError(res, 500, error.message);
    }
});
// ==================== RESET PASSWORD ====================
router.post("/reset-password", async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        if (!email || !token || !newPassword) {
            return sendError(res, 400, "Email, token, and new password are required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, 404, "User not found");
        }
        // Check token validity
        if (user.passwordResetToken !== token) {
            return sendError(res, 401, "Invalid reset token");
        }
        if (!user.passwordResetTokenExpiry ||
            user.passwordResetTokenExpiry < new Date()) {
            return sendError(res, 401, "Reset token has expired");
        }
        user.password = await hashPassword(newPassword);
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        await user.save();
        return sendSuccess(res, 200, "Password reset successfully");
    }
    catch (error) {
        console.error("Reset password error:", error);
        return sendError(res, 500, error.message);
    }
});
// ==================== VERIFY EMAIL ====================
router.post("/verify-email", async (req, res) => {
    try {
        const { email, token } = req.body;
        if (!email || !token) {
            return sendError(res, 400, "Email and token are required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, 404, "User not found");
        }
        if (user.emailVerificationToken !== token) {
            return sendError(res, 401, "Invalid verification token");
        }
        if (!user.emailVerificationTokenExpiry ||
            user.emailVerificationTokenExpiry < new Date()) {
            return sendError(res, 401, "Verification token has expired");
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpiry = undefined;
        await user.save();
        return sendSuccess(res, 200, "Email verified successfully");
    }
    catch (error) {
        console.error("Verify email error:", error);
        return sendError(res, 500, error.message);
    }
});
// ==================== RESEND VERIFICATION EMAIL ====================
router.post("/resend-verification-email", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return sendError(res, 400, "Email is required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, 404, "User not found");
        }
        if (user.isEmailVerified) {
            return sendError(res, 400, "Email is already verified");
        }
        const verificationToken = generateVerificationToken();
        user.emailVerificationToken = verificationToken;
        user.emailVerificationTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
        await user.save();
        // TODO: Send verification email
        // const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`;
        // await sendEmail(email, "Email Verification", `Click here to verify: ${verificationLink}`);
        console.log(`\n📧 Verification token for ${email}: ${verificationToken}`);
        return sendSuccess(res, 200, "Verification email sent");
    }
    catch (error) {
        console.error("Resend verification error:", error);
        return sendError(res, 500, error.message);
    }
});
export default router;
//# sourceMappingURL=authRoutes.js.map