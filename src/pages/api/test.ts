import connectDB from "../../database/db";
import { NextResponse } from "next/server";
import User from "../../database/userSchema";

/**
 * Example GET API route
 * @returns {message: string}
 */
// export async function GET() {
//   await connectDB();
//   return NextResponse.json({ message: "Hello from the API!" });
// }

export default async function handler(req, res) {
    await connectDB();

    if (req.method == "GET") {
        const random = await User.find({});
        console.log("Get called");
        console.log(random);
    }

    if (req.method == "POST") {
        try {
            const { email, password } = req.body;
            const newUser = new User({ email, password });
            await newUser.save();

            res.status(201).json({ message: "User created successfully!" });
        } catch (error) {
            console.log(error);
        }
    }

    res.status(200).json({ message: "Hello from the API!" });
}
