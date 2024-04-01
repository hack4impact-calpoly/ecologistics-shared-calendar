import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from "../../../database/db"
import Event from "../../../database/eventSchema"


 
type ResponseData = {
  message: string,
  data: any
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
  
    else{
      res.status(404).json({message:"Method Not Allowed", data:null})
    }
}