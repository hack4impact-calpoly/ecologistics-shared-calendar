import React from "react";

const ConfirmationPage: React.FC = () => {
  const handleReturn = () => {
    window.location.href = "/calendar";
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "25vw",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          Your Account Request is Pending Approval
        </h2>
        {/* Button to return to the specified page */}
        <button style={styles.button} onClick={handleReturn}>
          Go to Calendar
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1em",
    marginTop: "1em",
    color: "black",
    paddingTop: "0.7em",
    paddingBottom: "0.7em",
    backgroundColor: "#f7ab74",
    border: "none",
    borderRadius: "10px",
    width: "40%",
    cursor: "pointer",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
};

export default ConfirmationPage;
