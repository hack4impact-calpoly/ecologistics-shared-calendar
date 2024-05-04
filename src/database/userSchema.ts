import mongoose, { Schema, Document } from "mongoose";

// Interface for the User document
interface UserDocument extends Document {
    clerkId: string;
    email: string;
    organization: string;
    role: string;
    firstName: string;
    lastName: string;
    position: string;
    phoneNumber: string;
    createdAt: Date;
}

// Schema for the User
const UserSchema: Schema<UserDocument> = new Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    organization: { type: String },
    role: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    position: { type: String },
    phoneNumber: { type: String },
    createdAt: { type: Date, default: new Date() },
});

// Export the User model based on the schema
const UserModel =
    mongoose.models.Users || mongoose.model<UserDocument>("Users", UserSchema);

export default UserModel;
