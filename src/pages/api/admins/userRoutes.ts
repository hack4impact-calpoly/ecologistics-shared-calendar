import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../database/userSchema";
import connectDB from "../../../database/db";
import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import mongoose from "mongoose";
import { error } from "console";

type ResponseData = {
  message: string;
  data: any;
};

interface UserMetadata {
  role: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await connectDB();
  const method = req.method;

  switch (method) {
    case "GET":
      try {
        const { role } = req.query;
        let response;
        if (role) {
          response = await User.findOne({ role: role.toString() });
          if (!response) {
            return res
              .status(404)
              .json({ message: "User not found", data: "User not found" });
          }
          res.status(200).json({ message: "Success", data: response });
        } else {
          response = await User.find({});
        }
        res.status(200).json({ message: "success", data: response });
      } catch (error) {
        console.log(error);
        res.status(400).json({
          message: "Failure",
          data: error,
        });
      }
      break;

    default:
      res.status(405).json({
        data: error,
        message: "METHOD NOT ALLOWED. ONLY (GET, POST, DELETE) ALLOWED",
      });
      break;
  }
}
