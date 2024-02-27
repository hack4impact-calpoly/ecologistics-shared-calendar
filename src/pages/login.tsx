import { useState } from "react";
import Layout from "../components/layout";
import Link from "next/link";

//icons
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
//

export default function LoginPage() {
  const [email, setEmail] = useState(""); // to update the email the user enters
  const [password, setPassword] = useState(""); // to update the password the user enters
  //const [emailError, setEmailError] = useState(""); // to update the error if incorrect email is entered
  //const [passwordError, setPasswordError] = useState(""); // to update the error if incorrect password is entered

  const handleSubmit = (e) => {
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
    */

    console.log(email);
    console.log(password);
  };

  return (
    <Layout>
      {/* Main Container */}
      <div style={styles.mainContainer}>
        {/* Title Container */}
        <div
          style={{
            ...styles.subContainer,
            height: "26%",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ fontSize: "60%", fontWeight: "700" }}>
            Login To Your Account
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
  subContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    height: "26%",
    width: "73%",
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
    height: "100%",
    width: "100%",
    textDecoration: "none",
  },
  /*errorLabel: {
    color: "red",
    fontSize: "20%",
  },*/
  // icons
  icon: {
    fontSize: "45%",
    position: "relative",
    top: "8vh",
    right: "20vw",
  },
};
