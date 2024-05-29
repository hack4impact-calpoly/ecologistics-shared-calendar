import React from "react";

type EmailTemplateProps = {
    verification_code: String;
};

const EmailTemplate = ({ verification_code }: EmailTemplateProps) => (
    <div>
        <h1>Ecologistics Calendar Verfication Code</h1>
        <p>
            Here is your verification code: <b>{verification_code}</b>
        </p>
        <p>This code expires in 10 minutes.</p>
    </div>
);

export default EmailTemplate;
