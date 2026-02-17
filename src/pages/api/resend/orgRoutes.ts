import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from "next";

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
    //   emailAddress,
    //   firstName,
    //   orgName,
    //   deniedReason,
    //   eventTitle,
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
  const year : number = now.getFullYear();
  const month : number = now.getMonth() + 1;
  const day : number = now.getDate();
  
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

  const msg = {
    from: "onboarding@resend.dev", // "h4ih4h@gmail.com" (or desired ecologistics email),
    to: 'delivered@resend.dev', // emailAddress,
    subject: 'Hello World - Resend Testing',
    html: '<p>It worked!</p>',
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
