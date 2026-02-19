import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from "next";
import EmailDeniedTemplate from "../../../components/email-denied-template";
import EmailApprovedTemplate from "../../../components/email-approved-template";
import { ReactElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

// const { data, error } = await resend.emails.send({
//   from: 'Acme <onboarding@resend.dev>',
//   to: ['delivered@resend.dev'],
//   subject: 'hello world',
//   html: '<p>it works!</p>',
//   reply_to: 'onboarding@resend.dev',
// });




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
  } = req.body;

  if (!emailAddress || !firstName) {
    return res.status(400).json({
      message:
        "Missing required parameters (emailAddress, firstName)",
    });
  }

  try {
    await sendDynamicEmail(
      emailAddress,
      firstName,
      orgName,
      deniedReason,
      eventTitle,
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
) {

  const now : Date = new Date();
  
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Los_Angeles",
  });

  const date = now.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone: "America/Los_Angeles"
  });

  // date & time in format : HH:mm - MM/DD/YYYY
  const date_string : string = `${time} - ${date}`;

  // if there is a denied reason, this will be true
  const hasDeniedReason =
    typeof deniedReason === "string" && deniedReason.trim().length > 0;

  let react_content: ReactElement;

  // send request denied Email
  if(hasDeniedReason) {
    
    const templateProps = {
      firstName,
      orgName,
      deniedReason,
      eventTitle,
      date_string,
    };

    react_content = EmailDeniedTemplate ({...templateProps});
  }

  // send request approved email
  else {

    const templateProps = {
      firstName,
      orgName,
      deniedReason,
      eventTitle,
      date_string,
    };

    react_content = EmailApprovedTemplate({...templateProps});
  }
  

  const msg = {
    from: "onboarding@resend.dev", // "h4ih4h@gmail.com" (or desired ecologistics email),
    to: 'h4ih4h@gmail.com', // emailAddress,
    subject: 'Hello World - Resend Testing',
    react: react_content,
    //reply_to: 'h4ih4h@gmail.com',
  }
//   {
//     from: "info@ecologistics.org",
//     to: emailAddress,
//     first_name: firstName,
//     unique_name: orgName,
//     eventTitle: eventTitle,
//     deniedReason: deniedReason,
//     }
  await resend.emails.send(msg);
};
