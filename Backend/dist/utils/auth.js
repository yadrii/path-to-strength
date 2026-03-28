import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};
export const comparePasswords = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
export const generateAccessToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1d" });
};
export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || "your-refresh-secret", { expiresIn: "7d" });
};
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    }
    catch (error) {
        return null;
    }
};
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "your-refresh-secret");
    }
    catch (error) {
        return null;
    }
};
export const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString("hex");
};
export const generatePasswordResetToken = () => {
    return crypto.randomBytes(32).toString("hex");
};
//# sourceMappingURL=auth.js.map