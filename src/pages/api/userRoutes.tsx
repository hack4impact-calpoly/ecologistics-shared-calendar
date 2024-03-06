import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../database/userSchema";
import connectDB from "../../database/db";

// Handler for GET, POST, and DELETE requests for Users
export default async function handeler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const method = req.method;

  switch (method) {
    case "GET":
      try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false, message: error });
      }
      break;

    case "POST":
      try {
        const { email, password, accountType } = req.body;
        const user = await User.create({ email, password, accountType });
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, message: error });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.body;
        const result = await User.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Could not find user to delete" });
        }
        res
          .status(200)
          .json({ success: true, message: "User deleted successfully" });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to delete user",
          error: error.message,
        });
      }
      break;

    default:
      res.status(404).json({
        success: false,
        message: "METHOD NOT ALLOWED ONLY (GET, POST, DELETE) ALLOWED",
      });
  }
}
