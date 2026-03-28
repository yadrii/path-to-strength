import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    firebaseUid: string;
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: "user" | "ngo";
    profilePicture?: string;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationTokenExpiry?: Date;
    passwordResetToken?: string;
    passwordResetTokenExpiry?: Date;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=User.d.ts.map