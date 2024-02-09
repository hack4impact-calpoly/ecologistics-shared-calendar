import EmailTemplate from "../../components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    try {
        //check method type
        if (req.method === "POST") {
            //extract email from request body
            const { email } = req.body;

            // Send email using Resend library
            const { data, error } = await resend.emails.send({
                from: "Acme <onboarding@resend.dev>",
                to: [email],
                subject: "Hello world",
                react: EmailTemplate({ firstName: "John" }),
            });

            //error on send email
            if (error) {
                console.error("Error sending email:", error);
                return res.status(400).json({ error: "Error sending email" });
            }

            console.log("Email sent successfully:", data);

            //return status indicating successful email
            res.status(200).json({
                message: "Email sent successfully",
            });
        } else {
            res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
