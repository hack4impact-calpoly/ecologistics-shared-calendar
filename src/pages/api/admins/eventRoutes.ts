import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from "../../../database/db"
import Event from "../../../database/eventSchema"
import axios from "axios";


type ResponseData = {
  message: string,
  data: any
}

async function deleteImage(imageUrl: String) {
  console.log("IN DELETE IMAGE");
  const response = await axios.delete("http://localhost:3000/api/s3-upload/route", {
    data: { url: imageUrl },
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
  
) {
    await connectDB();
    if(req.method==="GET"){
      try{
        const allEvents=await Event.find({});
        res.status(200).json({message:"Fetched all events.", data:allEvents})
      } catch (err){
        res.status(404).json({message:"GET Failed.", data:err})
      }
    }
    else if(req.method==="POST"){
        try{
          const {title,description,date,location}=await req.body;
          const event=await Event.create({title,description,date,location});
          res.status(201).json({ message: 'Created event.' ,data:event})
        } catch (err){
          res.status(400).json({message:"POST Failed.", data:err})
        }
    }
    else if (req.method === "DELETE") {
      try {
        const { id } = req.body;
        const event = await Event.findByIdAndRemove(id.toString().trim());
        console.log("USER DELETE EVENT: ", event);
        console.log("DELETING IMAGE LINK: ", event.imageLink);
  
        if (event?.imageLink) {
          await deleteImage(event.imageLink);
        }
        res.status(200).json({ message: "Deleted event.", data: null });
      } catch (err) {
        res.status(404).json({ message: "DELETE Failed.", data: err });
      }
    } else if (req.method === "PATCH") {
      try {
        const { id, status, deniedReason } = await req.body;
        const updateFields = { status: status, deniedReason: deniedReason};
        console.log(updateFields);
        const updatedEvent = await Event.findByIdAndUpdate(
          id,
          updateFields,
          { new: true }
        );
        console.log("updatedEvent",updatedEvent);
        res.status(200).json({ message: 'Updated event status and deniedReason.', data: updatedEvent });
      } catch (err) {
        res.status(400).json({ message: "PATCH Failed.", data: err });
      }
    } else{
      res.status(404).json({message:"Method Not Allowed", data:null})
    }
}