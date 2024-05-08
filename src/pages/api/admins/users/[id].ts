import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import UserModel from "../../../../database/userSchema";
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
                const metadata = sessionClaims?.publicMetadata as UserMetadata;
                const cur_role = metadata?.role;
                if (!cur_role || cur_role !== "admin") {
                    res.status(403);
                }

                //get new role for user from request body
                const { role, declineMessage } = req.body;
                if (role !== "approved" && role !== "declined") {
                    res.status(403);
                }

                //find user in DB
                const user = await UserModel.findById(id);
                if (!user) {
                    res.status(404);
                }
                const clerkId = user.clerkId;

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
                if (declineMessage) user["declineMessage"] = declineMessage;
                await user.save();
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server Error" });
            }
            break;

        case "DELETE":
            try {
                // check for admin permission
                const { sessionClaims } = getAuth(req);
                const metadata = sessionClaims?.publicMetadata as UserMetadata;
                const cur_role = metadata?.role;
                if (!cur_role || cur_role !== "admin") {
                    res.status(403);
                }

                //find user in DB
                const user = await UserModel.findById(id);
                if (!user) {
                    res.status(404);
                }
                const clerkId = user.clerkId;

                //delete user from cerlk
                await axios.delete(
                    `https://api.clerk.com/v1/users/${clerkId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
                        },
                    }
                );

                await UserModel.findByIdAndDelete(id);

                //respond with status code 200
                res.status(200).json({ message: "User deleted successfully" });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server Error on DELETE" });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
