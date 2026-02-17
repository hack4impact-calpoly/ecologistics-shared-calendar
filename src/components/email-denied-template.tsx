import React from "react";

type EmailDeniedTemplateProps = {
    firstName: string;
    orgName: string;
    deniedReason: string;
    eventTitle: string;
    date_string: string;
};

const EmailDeniedTemplate = (props: EmailDeniedTemplateProps) => (
    <div>
        <h1>Your Event Request Was Not Approved</h1>
        <p>
            Hi <b>{props.firstName}</b> from <b>{props.orgName}</b>,
            we recieved your request for your event : <b>{props.eventTitle}</b>.
        </p>
        <p>
            Your request was denied for the following reason(s) : <b>{props.deniedReason}</b>
        </p>

        <br/>
        <p>Sincerely, The Ecologistics Team</p>
        <br/>
        <p>{props.date_string}</p>
    </div>
);

export default EmailDeniedTemplate;