import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from "next";
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
    eventDescription,
    eventTimeAndDate,
    templateId
  } = req.body;


// I don't think I need this : 

  // if (!emailAddress || !firstName) {
  //   return res.status(400).json({
  //     message:
  //       "Missing required parameters (emailAddress, firstName)",
  //   });
  // }

  try {
    await sendDynamicEmail(
      emailAddress,
      firstName,
      orgName,
      deniedReason,
      eventTitle,
      eventDescription,
      eventTimeAndDate,
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
  eventDescription: string,
  eventTimeAndDate: string,
  templateId: string,
) {

  // const now : Date = new Date();
  
  // const time = now.toLocaleTimeString("en-US", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: true,
  //   timeZone: "America/Los_Angeles",
  // });

  // const date = now.toLocaleDateString("en-US", {
  //   month: "2-digit",
  //   day: "2-digit",
  //   year: "numeric",
  //   timeZone: "America/Los_Angeles"
  // });

  // // date & time in format : HH:mm - MM/DD/YYYY
  // const date_string : string = `${time} - ${date}`;

  // // if there is a denied reason, this will be true
  // const hasDeniedReason =
  //   typeof deniedReason === "string" && deniedReason.trim().length > 0;

  // let react_content: ReactElement;

  // // send request denied Email
  // if(hasDeniedReason) {
    
  //   const templateProps = {
  //     firstName,
  //     orgName,
  //     deniedReason,
  //     eventTitle,
  //     date_string,
  //   };
  // }

  // // send request approved email
  // else {

  //   const templateProps = {
  //     firstName,
  //     orgName,
  //     deniedReason,
  //     eventTitle,
  //     date_string,
  //   };

  //   react_content = EmailApprovedTemplate({...templateProps});
  // }

  let template: {};

  switch(templateId) {

    case 'org-registration-pending-client' :
      template = {
        id: templateId,
        variables: {
          firstName: firstName,
          orgName: orgName,
        }
      }
      break;

    case 'org-registration-denial-client' :
      template = {
        id: templateId,
        variables: {
          firstName: firstName,
          orgName: orgName,
          deniedReason: deniedReason,
        }
      }
      break;

      case 'org-registration-approval-client' :
      template = {
        id: templateId,
        variables: {
          firstName: firstName,
          orgName: orgName,
        }
      }
      break;



  }
  

  const msg = {
    from: "onboarding@resend.dev", // "h4ih4h@gmail.com" (or desired ecologistics email),
    to: 'h4ih4h@gmail.com', // emailAddress,
    template,
  }

  await resend.emails.send({...msg});
};
