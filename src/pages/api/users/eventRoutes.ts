import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../database/db";
import Event from "../../../database/eventSchema";
import User from "../../../database/userSchema";
import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import mongoose from "mongoose";
type ResponseData = {
  message: string;
  data: any;
};

interface QueryParams {
  _id: string;
  status: string;
}

const getQueryObject = (req: NextApiRequest): Partial<QueryParams> => {
  let queryObject: Partial<QueryParams> = {};

  if (req.query.id) {
    const { id } = req.query;
    queryObject._id = id as string;
  }

  if (req.query.status) {
    const { status } = req.query;
    queryObject.status = status as string;
  }

  return queryObject;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await connectDB();
  if (req.method === "GET") {
    try {
      const { _id } = req.query;
      if (_id) {
        const userId = new mongoose.Types.ObjectId(_id.toString());
        const userEvents = await Event.find({ createdBy: userId });
        if (!userEvents) {
          res.status(404).json({ data: "User not found" });
        }
        res.status(200).json({ success: true, data: userEvents });
      } else {
        res
          .status(404)
          .json({ message: "GET Failed.", data: "No user supplied" });
      }
    } catch (err) {
      res.status(404).json({ message: "GET Failed.", data: err });
    }
  } else if (req.method === "POST") {
    try {
      const {
        organization,
        title,
        startDate,
        endDate,
        description,
        isVirtual,
        location,
        status,
        imageLink,
      } = await req.body;

      // console.log("AFTER: ", req.body);
      const { userId: clerkId } = getAuth(req);

      const user = await User.findOne({ clerkId });
      // console.log("USER: ", user);

      const event = await Event.create({
        organization,
        title,
        startDate,
        endDate,
        description,
        isVirtual,
        location,
        status,
        imageLink,
        createdBy: user._id,
      });

      res.status(201).json({ message: "Created event.", data: event });
    } catch (err) {
      res.status(400).json({ message: "POST Failed.", data: err });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      await Event.findByIdAndRemove(id.toString().trim());
      res.status(200).json({ message: "Deleted event.", data: null });
    } catch (err) {
      res.status(404).json({ message: "DELETE Failed.", data: err });
    }
  } else {
    res.status(404).json({ message: "Method Not Allowed", data: null });
  }
}
