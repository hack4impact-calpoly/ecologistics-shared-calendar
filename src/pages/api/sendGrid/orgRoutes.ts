import sgMail from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    emailAddress,
    firstName,
    orgName,
    deniedReason,
    eventTitle,
    templateId,
  } = req.body;

  if (!emailAddress || !firstName || !templateId) {
    return res.status(400).json({
      message:
        "Missing required parameters (emailAddress, firstName, templateId)",
    });
  }

  try {
    await sendDynamicEmail(
      emailAddress,
      firstName,
      orgName,
      deniedReason,
      eventTitle,
      templateId
    );
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send email" });
  }
}

async function sendDynamicEmail(
  emailAddress: string,
  firstName: string,
  orgName: string,
  deniedReason: string,
  eventTitle: string,
  templateId: string
) {
  const msg = {
    to: emailAddress,
    from: "info@ecologistics.org",
    templateId: templateId,
    dynamic_template_data: {
      first_name: firstName,
      unique_name: orgName,
      eventTitle: eventTitle,
      deniedReason: deniedReason,
    },
  };

  await sgMail.send(msg);
}
