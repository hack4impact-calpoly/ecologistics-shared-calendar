import mongoose, { Schema, Document } from "mongoose";

// Interface for the User document
interface UserDocument extends Document {
  email: string;
  password: string;
  accountType: "user" | "admin"; // Account type: user or admin
}

// Schema for the User
const UserSchema: Schema<UserDocument> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { type: String, enum: ["user", "admin"], required: true }, // Specify account type
});

// Export the User model based on the schema
const UserModel =
  mongoose.models.Users || mongoose.model<UserDocument>("Users", UserSchema);

export default UserModel;