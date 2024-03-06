import React from "react";

const ConfirmationPage: React.FC = () => {
  const handleReturn = () => {
    // Navigate to the specified page
    window.location.href = "/signup";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {/* Checkmark icon */}
      <span style={{ fontSize: "60px", color: "green" }}>✓</span>
      <h2>Confirmation</h2>
      <p>Your action has been confirmed.</p>
      {/* Button to return to the specified page */}
      <button onClick={handleReturn}>Return</button>
    </div>
  );
};

export default ConfirmationPage;
