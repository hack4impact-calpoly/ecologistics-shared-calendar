import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import UserModel from "@/database/userSchema";

import { getAuth } from "@clerk/nextjs/server";
// pages/api/user/[id].js

interface UserMetadata {
    role: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        method,
        query: { id },
    } = req;

    switch (method) {
        case "PATCH":
            // Handle PUT request to update user by ID
            try {
                //Verify admin role from clekr
                const { sessionClaims } = getAuth(req);
                let { role } = sessionClaims.publicMetadata as UserMetadata;
                if (!role || role !== "admin") {
                    res.status(403);
                }

                //get new role for user from request body
                role = req.body.role;
                if (role !== "approved" && role !== "declined") {
                    res.status(403);
                }

                //find user in DB
                const user = await UserModel.findById(id);
                const clerkId = user.clerkId;
                if (!user) {
                    res.status(404);
                }

                //update role on clerk
                await axios.patch(
                    `https://api.clerk.com/v1/users/${clerkId}/metadata`,
                    {
                        public_metadata: {
                            role: role,
                        },
                        private_metadata: {},
                        unsafe_metadata: {},
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
                        },
                    }
                );

                //update role in mongodb
                user.role = role;
                await user.save();
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server Error" });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
