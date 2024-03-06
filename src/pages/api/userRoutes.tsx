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
        const userInfo = { email: "", password: "", accountType: "" };
        userInfo.email = req.body.email;
        userInfo.password = req.body.password;
        userInfo.accountType = req.body.accountType;
        console.log(userInfo);
        const user = await User.create(userInfo);
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, message: error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
