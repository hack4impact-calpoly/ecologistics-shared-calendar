import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../database/userSchema";
import connectDB from "../../database/db";
import { clerkClient } from "@clerk/nextjs";
import { OrganizationInvitation, getAuth } from "@clerk/nextjs/server";
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
                const { userId: clerkId } = getAuth(req);
                console.log(clerkId);
                if (clerkId) {
                    const user = await User.findOne({ clerkId });
                    if (!user) {
                        return res.status(404).json({ data: "User not found" });
                    }
                    res.status(200).json({ success: true, data: user });
                }
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
                //parse session and request body
                const { userId: clerkId } = getAuth(req);
                const {
                    organization,
                    email,
                    phoneNumber,
                    lastName,
                    firstName,
                    position,
                } = req.body;

                //add role to clerk user
                await clerkClient.users.updateUserMetadata(clerkId.toString(), {
                    publicMetadata: {
                        role: "pending",
                    },
                });

                //create user in mongodb
                const user = await User.create({
                    clerkId: clerkId,
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
        case "PATCH":
            try {
                // parse clerk session
                const { userId: clerkId } = getAuth(req);

                //parse request body
                const {
                    organization,
                    email,
                    phoneNumber,
                    lastName,
                    firstName,
                    position,
                    role,
                } = req.body;

                //get User
                let user = await User.findOne({ clerkId });
                if (!user) {
                    res.status(400).json({
                        success: false,
                        message: "User not found",
                    });
                }
                //fname/lname on clerk
                await clerkClient.users.updateUser(clerkId.toString(), {
                    firstName: firstName,
                    lastName: lastName,
                });

                user = await User.findOneAndUpdate(
                    { clerkId: clerkId },
                    {
                        organization: organization,
                        email: email,
                        phoneNumber: phoneNumber,
                        position: position,
                        firstName: firstName,
                        lastName: lastName,
                        role: role,
                    }
                );
                res.status(201).json({ success: true, data: user });
            } catch (error) {
                res.status(400).json({ success: false, message: error });
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
