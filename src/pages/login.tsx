import React, { useState } from "react";
import Layout from "../components/layout";
import Link from "next/link";

//icons
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/LockOutlined";
//

export default function LoginPage() {
  const [email, setEmail] = useState(""); // to update the email the user enters
  const [password, setPassword] = useState(""); // to update the password the user enters
  //const [emailError, setEmailError] = useState(""); // to update the error if incorrect email is entered
  //const [passwordError, setPasswordError] = useState(""); // to update the error if incorrect password is entered

  const handleSubmit = (e: { preventDefault: () => void }) => {
    // We will implement this later
    // Activated when login button is clicked

    e.preventDefault();

    /*
    // Set initial error values to empty
    setEmailError("");
    setPasswordError("");

    // Check if the user has entered both fields correctly
    if ("" === email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    <PersonIcon style={styles.icon}></PersonIcon>
    <LockIcon style={styles.icon}></LockIcon>
    */

    console.log(email);
    console.log(password);
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
          <h2 style={styles.title}>Login To Your Account</h2>
          <p style={styles.subtitle}>Organizations & Charities Only</p>

          <div className="inputBox" style={styles.inputBox}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>

            <div style={styles.inputContainer}>
              <PersonIcon style={styles.icon}></PersonIcon>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email Address"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="inputBox" style={styles.inputBox}>
            <label htmlFor="email" style={styles.label}>
              Password
            </label>

            <div style={styles.inputContainer}>
              <LockIcon style={styles.icon}></LockIcon>
              <input
                type="password"
                id="email"
                placeholder="Enter Your Password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ paddingTop: "1vw" }}></div>

          <button
            type="submit"
            style={{ ...styles.button, ...styles.buttonSent }}
          >
            {"Login"}
          </button>

          <div style={styles.bottomText}>Forgot Password?</div>

          <div style={styles.bottomText}>
            Don&apos;t Have an Account? Apply for one now!
          </div>

          <button
            type="submit"
            style={{ ...styles.button, ...styles.buttonSent }}
          >
            {"Sign Up"}
          </button>
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: "1em",
    width: "50%",
    boxSizing: "border-box",
  },
  label: {
    fontFamily: "DM Sans",
    fontSize: "1.5625em",
    marginLeft: "0.2em",
  },
  input: {
    fontFamily: "DM Sans",
    padding: "0.3em",
    paddingLeft: "1.5em",
    fontSize: "2em",
    color: "black",
    width: "100%",
    border: "1px solid black",
    borderRadius: "4px",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
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
  icon: {
    fontSize: "200%",
    transform: "translateY(-50%)",
    position: "absolute",
    left: "10px",
    top: "50%",
    pointerEvents: "none",
  },
};
