import { useState } from "react";
import Layout from "../components/layout";
import Link from "next/link";
import { useRouter } from "next/router";

//icons
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import React from "react";
//

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    // We will implement this later
    // Activated when login button is clicked

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
    } else {
      router.push("/calendar");
    }

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
          <div style={{ fontSize: "32%" }}>Organizations & Charities Only</div>
        </div>
        <div
          style={{
            ...styles.subContainer,
            height: "46%",
            justifyContent: "flex-start",
          }}
        >
          {/* Email Input Box */}
          <PersonIcon style={styles.icon}></PersonIcon>
          <div style={styles.inputContainer}>
            <div style={styles.textAboveInputBox}>Username</div>
            <input
              value={email}
              placeholder="Enter Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
              style={styles.inputBox}
            />
            {/*<label style={styles.errorLabel}>{emailError}</label>*/}
          </div>
          {/* Password Input Box */}
          <LockIcon style={styles.icon}></LockIcon>
          <div style={styles.inputContainer}>
            <div style={styles.textAboveInputBox}>Password</div>
            <input
              value={password}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputBox}
            />
            {/* <label style={styles.errorLabel}>{passwordError}</label> */}
          </div>
          {/* Login Button */}
          <div style={styles.loginButtonContainer}>
            <button
              style={styles.loginButton}
              type="submit"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </div>
        {/* Signup Button */}
        <div
          style={{
            ...styles.subContainer,
            height: "28%",
            justifyContent: "flex-end",
          }}
        >
          <div style={styles.textAboveSignup}>
            Dont Have an Account? Apply for one now!
          </div>
          <div style={styles.signupButtonContainer}>
            <Link prefetch={false} href="/" style={styles.signupLink}>
              <button style={styles.signupButton}>Sign up</button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
const styles = {
  // Inline Styling
  mainContainer: {
    fontFamily: "Inter, sans-serif",
    fontStyle: "normal",
    fontWeight: "400",
    color: "#000",
    fontSize: "5vw",
    display: "flex",
    flexDirection: "column",
    width: "61vw",
    height: "73vh",
    alignItems: "stretch",
    justifyContent: "start",
    margin: "10vh auto 10vh auto",
    padding: 0,
    border: "6px solid black",
    borderRadius: "9px",
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
    height: "68%",
    padding: "0 0 0 5vw",
    border: "1px solid #000",
    borderRadius: "9px",
    fontSize: "30%",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
  textAboveInputBox: {
    height: "32%",
    fontSize: "25%",
  },
  loginButtonContainer: {
    height: "18%",
    width: "20%",
  },
  loginButton: {
    fontSize: "30%",
    width: "100%",
    height: "100%",
    border: "3px solid #000",
    borderRadius: "9px",
    background: "white",
  },
  textAboveSignup: {
    height: "11%",
    margin: "1vh",
    fontSize: "20%",
  },
  signupButtonContainer: {
    height: "20%",
    width: "14%",
    margin: "0 0 3vh 0",
  },
  signupButton: {
    height: "100%",
    width: "100%",
    fontSize: "20%",
    textDecoration: "none",
    textAlign: "center",
    background: "white",
    borderRadius: "9px",
    border: "3px solid black",
  },
  signupLink: {
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
