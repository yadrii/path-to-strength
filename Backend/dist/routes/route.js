import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/", (req, res) => {
    res.send("API is working");
});
router.get("/protected", verifyToken, (req, res) => {
    res.send(`Hello user`);
});
router.get("/ngo-protected", (req, res) => {
    res.send(`Hello NGO`);
});
//# sourceMappingURL=route.js.map