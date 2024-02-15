import React from "react";

const EmailTemplate = ({ firstName }) => (
    <div>
        <h1>Welcome, {firstName}!</h1>
        <p>Instructions to reset your password.</p>
    </div>
);

export default EmailTemplate;
