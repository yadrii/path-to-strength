import mongoose, { Schema, Document } from "mongoose";
const userSchema = new Schema({
    firebaseUid: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    role: { type: String, enum: ["user", "ngo"], required: true },
    profilePicture: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationTokenExpiry: { type: Date },
    passwordResetToken: { type: String },
    passwordResetTokenExpiry: { type: Date },
    lastLogin: { type: Date },
}, { timestamps: true });
// Index for email verification token
userSchema.index({
    emailVerificationToken: 1,
    emailVerificationTokenExpiry: 1,
});
userSchema.index({ passwordResetToken: 1, passwordResetTokenExpiry: 1 });
export const User = mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map