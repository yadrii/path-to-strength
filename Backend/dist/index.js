import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "./routes/authRoutes";
import incidentLogsRoutes from "./routes/incidentLogsRoutes";
import * as serviceAccount from "./serviceAccountKey.json";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:8080",
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin like mobile apps or curl
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
    },
    credentials: true,
}));
// Firebase Admin SDK
const serviceAccountData = serviceAccount.default ?? serviceAccount;
// clone to avoid read-only object issues from module namespace export
const firebaseCredential = JSON.parse(JSON.stringify(serviceAccountData));
admin.initializeApp({
    credential: admin.credential.cert(firebaseCredential),
});
// Connect to MongoDB
connectDB();
// Routes
app.get("/", (req, res) => {
    res.json({ message: "🚀 Sahara Backend API is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentLogsRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error",
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});
//# sourceMappingURL=index.js.map