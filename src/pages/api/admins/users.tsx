import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../database/userSchema";
import connectDB from "../../../database/db";
import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";

interface UserMetadata {
    role: string;
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

                /*
                const { clerkId } = req.query;
                if (clerkId) {
                    const user = await User.findOne({ clerkId });
                    if (!user) {
                        return res.status(404).json({ data: "User not found" });
                    }
                    res.status(200).json({ success: true, data: user });
                }
                */
                res.status(200).json({ success: true, data: users });
            } catch (error) {
                console.log(error);
                res.status(400).json({
                    success: false,
                    message: error,
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
