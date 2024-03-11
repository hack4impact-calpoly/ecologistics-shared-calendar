import React from "react";

interface PopupProps {
  onClose: () => void;
}

const EventRequestPopup: React.FC<PopupProps> = ({ onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <p style={styles.message}>Your event request is pending approval.</p>
        <button style={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "4px",
    textAlign: "center",
    width: "25%",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  message: {
    marginBottom: "20px",
    fontWeight: "bold",
    fontSize: "2rem",
  },
  closeButton: {
    backgroundColor: "black",
    color: "white",
    border: "none",
    padding: "10px 20px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    borderRadius: "20px",
    cursor: "pointer",
  },
};

export default EventRequestPopup;
