import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../database/db";
import Event from "../../../database/eventSchema";
import mongoose from "mongoose";

type ResponseData = {
  message: string;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
      const { title, description, date, location } = await req.body;
      const event = await Event.create({ title, description, date, location });
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
