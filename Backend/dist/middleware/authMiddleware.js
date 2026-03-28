import express from "express";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ success: false, message: "No token provided" });
        }
        const token = authHeader.split("Bearer ")[1];
        // Try to verify as JWT first (from our own auth system)
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
            req.user = { userId: decoded.userId, role: decoded.role };
            return next();
        }
        catch (jwtError) {
            // If JWT verification fails, try Firebase
            try {
                const decoded = await admin.auth().verifyIdToken(token);
                req.user = { userId: decoded.uid, email: decoded.email };
                return next();
            }
            catch (firebaseError) {
                return res
                    .status(401)
                    .json({ success: false, message: "Invalid token" });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export default verifyToken;
//# sourceMappingURL=authMiddleware.js.map