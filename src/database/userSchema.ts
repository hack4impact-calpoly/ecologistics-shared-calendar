import mongoose, { Schema } from "mongoose";

//! Example user schema. Not guaranteed to work
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.models.Users ||
  mongoose.model("Users", UserSchema, "Users");
