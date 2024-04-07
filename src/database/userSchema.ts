import mongoose, { Schema, Document } from "mongoose";

// Interface for the User document
interface UserDocument extends Document {
    clerkId: string;
    email: string;
    role: "user" | "admin"; // Account type: user or admin
    organization: string;
}

// Schema for the User
const UserSchema: Schema<UserDocument> = new Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true }, // Specify account type
    organization: { type: String, required: true },
});

// Export the User model based on the schema
const UserModel =
    mongoose.models.Users || mongoose.model<UserDocument>("Users", UserSchema);

export default UserModel;
