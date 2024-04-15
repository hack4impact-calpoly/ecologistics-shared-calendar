import React from "react";

type EmailTemplateProps = {
  firstName: string;
};

const EmailTemplate = ({ firstName }: EmailTemplateProps) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>Instructions to reset your password.</p>
  </div>
);

export default EmailTemplate;
