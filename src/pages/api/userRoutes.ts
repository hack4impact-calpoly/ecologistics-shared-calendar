import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../database/userSchema";
import connectDB from "../../database/db";
import { OrganizationInvitation, getAuth } from "@clerk/nextjs/server";
import axios from "axios";

interface UserMetadata {
    role: string;
    organization: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDB();
    const method = req.method;

    switch (method) {
        case "GET":
            try {
                const users = await User.find({});
                
                const {clerkId}=req.query;
                if(clerkId){
                    const user=await User.findOne({clerkId});
                    if (!user) {
                        return res.status(404).json({ data: 'User not found' });
                    }
                    res.status(200).json({ success: true, data: user});
                }
                res.status(200).json({ success: true, data: users });
            } catch (error) {
                console.log(error);
                res.status(400).json({
                    success: false,
                    message: error,
                });
            }
            break;

        case "POST":
            try {
                const { userId } = getAuth(req);
                const {
                    organization,
                    email,
                    phoneNumber,
                    lastName,
                    firstName,
                    position,
                } = req.body;

                const user = await User.create({
                    clerkId: userId,
                    organization: organization,
                    email: email,
                    phoneNumber: phoneNumber,
                    position: position,
                    firstName: firstName,
                    lastName: lastName,
                    role: "pending",
                });
                res.status(201).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({
                    success: false,
                    message: error,
                });
            }
            break;
        
        case "PUT":
            try {
                const { userId } = getAuth(req);
                const {
                    organization,
                    email,
                    phoneNumber,
                    lastName,
                    firstName,
                    position,
                    role
                } = req.body;
                
                const {clerkId}=req.query;
                
                await axios.patch(
                    `https://api.clerk.com/v1/users/${userId}/metadata`,
                    {
                        public_metadata: {
                            organization: organization,
                            role: role
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
                        },
                    }
                ).then((data) => {
                    console.log(data);
                  }).catch((error) => {
                    console.error("Error:", error);
                  });
                const user = await User.findOneAndUpdate({clerkId:clerkId}, {
                    clerkId: userId,
                    organization: organization,
                    email: email,
                    phoneNumber: phoneNumber,
                    position: position,
                    firstName: firstName,
                    lastName: lastName,
                    role: role
                });
                res.status(201).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({
                    success: false,
                    message: error,
                });
            }
            break;

        case "DELETE":
            try {
                const { id } = req.body;
                const result = await User.deleteOne({ _id: id });
                if (result.deletedCount === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Could not find user to delete",
                    });
                }
                res.status(200).json({
                    success: true,
                    message: "User deleted successfully",
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to delete user",
                    error: error,
                });
            }
            break;

        default:
            res.status(405).json({
                success: false,
                message: "METHOD NOT ALLOWED. ONLY (GET, POST, DELETE) ALLOWED",
            });
            break;
    }
}
