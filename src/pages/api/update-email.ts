import EmailTemplate from "../../components/email-template";
import { Resend } from "resend";
import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../database/userSchema";
import connectDB from "../../database/db";
import { clerkClient } from "@clerk/nextjs";
import { OrganizationInvitation, getAuth } from "@clerk/nextjs/server";

const resend = new Resend(process.env.RESEND_API_KEY as string);

interface ResponseData {
    message?: string;
    error?: string;
}

//POST SEND CODE AND EMAIL
//PATCH VERIFY EMAIL CODE

function generateSixDigitNumber(): String {
    // Generate a random number between 100000 and 999999
    const min = 100000;
    const max = 999999;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

// Function to calculate the expiration date (10 minutes from now)
function getExpirationDate() {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 10);
    return expirationDate;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDB();
    const method = req.method;
    switch (method) {
        case "POST":
            try {
                //parse session and request body
                const { userId: clerkId } = getAuth(req);
                const { email } = req.body;

                res.status(200).json({
                    success: true,
                    message: "Verification email sent successfully",
                });

                //store verification code in private metadata with expiration date
                const verification_code = generateSixDigitNumber();
                await clerkClient.users.updateUserMetadata(
                    clerkId?.toString() || "",
                    {
                        privateMetadata: {
                            pending_email: email,
                            verification_code: verification_code,
                            expiration_date: getExpirationDate(),
                        },
                    }
                );
                console.log("code", verification_code);

                //Send email using Resend library
                const { data, error } = await resend.emails.send({
                    from: "Acme <noreply@resend.dev>",
                    to: [email],
                    subject: "Update Email Verification Code",
                    react: EmailTemplate({
                        verification_code: verification_code,
                    }),
                });

                //error on send email
                if (error) {
                    console.error("Error sending email:", error);
                    return res
                        .status(400)
                        .json({ error: "Error sending email" });
                }

                res.status(200).json({
                    success: true,
                    message: "Sent verification code",
                });
            } catch (error) {
                res.status(400).json({
                    success: false,
                    message: error,
                });
            }

        case "PATCH":
            try {
                //parse session and request body
                const { userId: clerkId } = getAuth(req);
                const { code } = req.body;

                //get user and parse metadata
                const user = await clerkClient.users.getUser(
                    clerkId?.toString() || ""
                );
                const previousEmailAddressId = user.primaryEmailAddressId;
                const {
                    pending_email: email,
                    expiration_date,
                    verification_code,
                } = user.privateMetadata;

                //check for valid verification code
                const current_date = new Date();
                if (
                    code !== verification_code ||
                    current_date > new Date(expiration_date as string)
                ) {
                    res.status(401).json({
                        success: false,
                        message: "Invalid Code",
                    });
                }

                //clear private metadata
                await clerkClient.users.updateUserMetadata(
                    clerkId?.toString() || "",
                    {
                        privateMetadata: {
                            pending_email: null,
                            verification_code: null,
                            expiration_date: null,
                        },
                    }
                );

                //create new email
                const email_object =
                    await clerkClient.emailAddresses.createEmailAddress({
                        userId: clerkId || "",
                        emailAddress: email as string,
                        verified: true,
                        primary: true,
                    });

                //delete previous email
                await clerkClient.emailAddresses.deleteEmailAddress(
                    previousEmailAddressId || ""
                );

                //update email in MongoDB
                await User.findOneAndUpdate(
                    { clerkId: clerkId },
                    { email: email }
                );
                res.status(200).json({
                    success: true,
                    message: "Change email successfully",
                });
            } catch (error) {
                res.status(500);
            }
            break;

        default:
            break;
    }
}
