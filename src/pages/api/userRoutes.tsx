import type { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../database/userSchema";
import connectDB from "../../database/db";

// Handler for GET, POST, and DELETE requests
export default async function handeler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const method = req.method;

  switch (method) {
    case "GET":
      try {
        const users = await UserModel.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false, message: "Failed to GET user" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
