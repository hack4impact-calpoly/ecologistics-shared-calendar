import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../database/db";
import Event from "../../../database/eventSchema";
import User from "../../../database/userSchema";
import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";

type ResponseData = {
  message: string;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await connectDB();
  if (req.method === "GET") {
    try {
      const allEvents = await Event.find({});
      res.status(200).json({ message: "Fetched all events.", data: allEvents });
    } catch (err) {
      res.status(404).json({ message: "GET Failed.", data: err });
    }
  } else if (req.method === "POST") {
    try {
      // console.log("Received body:", req.body);
      // console.log("Types:", {
      //   organization: typeof req.body.organization + req.body.organization,
      //   title: typeof req.body.title +  req.body.title,
      //   startDate: typeof req.body.startDate + req.body.startDate,
      //   endDate: typeof req.body.endDate + req.body.endDate,
      //   description: typeof req.body.description + req.body.description,
      //   isVirtual: typeof req.body.isVirtual + req.body.isVirtual,
      //   location: typeof req.body.location + req.body.location,
      //   status: typeof req.body.status + req.body.status,
      //   imageLink: typeof req.body.imageLink + req.body.imageLink,
      // });
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
      console.log("USER: ", user);

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
      console.log(err);
      res.status(400).json({ message: "POST Failed.", data: err });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = await req.body;
      await Event.findByIdAndDelete({ _id: id });
      res.status(200).json({ message: "Deleted event.", data: null });
    } catch (err) {
      res.status(404).json({ message: "DELETE Failed.", data: err });
    }
  } else {
    res.status(404).json({ message: "Method Not Allowed", data: null });
  }
}
