import React from "react";

type EmailApprovedTemplateProps = {
    firstName: string;
    orgName: string;
    eventTitle: string;
    date_string: string;
};

const EmailApprovedTemplate = (props: EmailApprovedTemplateProps) => (
    <div>
        <h1>Your Event Request Was Approved!</h1>
        <p>
            Hi <b>{props.firstName}</b> from <b>{props.orgName}</b>,
            we recieved your request for your event : <b>{props.eventTitle}</b>.
        </p>
        <p>
            Your request was approved, and was posted at the following time : <b>{props.date_string}</b>
        </p>

        <br/>
        <p>Sincerely, The Ecologistics Team</p>
        <br/>
        <p>{props.date_string}</p>
    </div>
);

export default EmailApprovedTemplate;