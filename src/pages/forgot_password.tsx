import React, { useState } from "react";
import Layout from "../components/layout";
//import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setSent(true);
    axios.post("/api/forgot_password", { email: email });
    setStatusMessage("Instructions have been sent to your email.");
    // Here, you'd also include the API call to actually send the email
  };

  return (
    <Layout>
      <style jsx>{`
        input::placeholder {
          color: grey;
        }
      `}</style>
      <div style={styles.container}>
        <form style={styles.formBox} onSubmit={handleSubmit}>
          <h2 style={styles.title}>Forgot Your Password?</h2>
          <p style={styles.subtitle}>Organizations & Charities Only</p>

          <div className="inputBox" style={styles.inputBox}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <div style={styles.inputContainer}>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email Address"
                style={styles.input}
                value={email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={styles.bottomText}>
            Enter your email to reset your password!
          </div>

          <button
            type="submit"
            style={
              sent ? { ...styles.button, ...styles.buttonSent } : styles.button
            }
            disabled={sent}
          >
            {sent ? "Sent" : "Reset Password"}
          </button>

          {statusMessage && <p style={styles.statusMessage}>{statusMessage}</p>}
        </form>
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "10vh",
    width: "100%",
    backgroundColor: "white",
  },
  formBox: {
    borderRadius: "8px",
    backgroundColor: "white",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontFamily: "DM Sans",
    fontSize: "3.75em",
    textAlign: "center",
    marginBottom: "-0.5em",
  },
  subtitle: {
    fontFamily: "DM Sans",
    fontSize: "2em",
    textAlign: "center",
  },
  inputBox: {
    marginTop: "1em",
    width: "51%",
  },
  label: {
    fontFamily: "DM Sans",
    fontSize: "1.5625em",
    marginLeft: "0.2em",
  },
  input: {
    fontFamily: "DM Sans",
    padding: "0.3em",
    paddingLeft: "0.5em",
    fontSize: "2em",
    color: "black",
    width: "100%",
    border: "1px solid black",
    borderRadius: "4px",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
  bottomText: {
    marginTop: "1.5625em",
    marginBottom: "1.5625em",
    fontSize: "1em",
  },
  button: {
    fontFamily: "DM Sans",
    fontSize: "1em",
    color: "black",
    paddingTop: "0.7em",
    paddingBottom: "0.7em",
    backgroundColor: "#F7AB74",
    border: "None",
    borderRadius: "10px",
    width: "12%",
    cursor: "pointer",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
  statusMessage: {
    fontFamily: "DM Sans",
    textAlign: "center",
    marginTop: "20px",
    fontSize: "1em",
    color: "#28a745",
  },
};
