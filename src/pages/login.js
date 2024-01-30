import { useState } from "react";
import Layout from "../components/layout";
import Link from "next/link";
export default function LoginPage() {
  const [email, setEmail] = useState(""); // to update the email the user enters
  const [password, setPassword] = useState(""); // to update the password the user enters
  const [emailError, setEmailError] = useState(""); // to update the error if incorrect email is entered
  const [passwordError, setPasswordError] = useState(""); // to update the error if incorrect password is entered

  const handleSubmit = (e) => {
    // We will implement this later
    // Activated when login button is clicked
    e.preventDefault();

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

    console.log(email);
    console.log(password);
  };

  return (
    <Layout>
      {/* Main Container */}
      <div style={styles.mainContainer}>
        {/* Title Container */}
        <div style={styles.titleContainer}>
          <div>Login To Your Account</div>
        </div>
        {/* Email Input Box */}
        <div style={styles.inputEmailAddress}>
          <div style={styles.textAboveInputBox}>Username</div>
          <input
            value={email}
            placeholder="Enter Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
            style={styles.inputBox}
          />
          <label style={styles.errorLabel}>{emailError}</label>
        </div>
        <br />
        {/* Password Input Box */}
        <div style={styles.inputPassword}>
          <div style={styles.textAboveInputBox}>Password</div>
          <input
            value={password}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            style={styles.inputBox}
          />
          <label style={styles.errorLabel}>{passwordError}</label>
        </div>
        {/* Login Button */}
        <div>
          <button
            style={styles.loginButton}
            type="submit"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
        {/* Signup Button */}
        <div>
          <div style={styles.textAboveSignup}>
            Dont Have an Account? Apply for one now!
          </div>
          <Link prefetch={false} href="/" style={styles.signupLink}>
            <button style={styles.signupButton}>Sign up</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
const styles = {
  // Inline Styling
  mainContainer: {
    height: "796px",
    width: "1067px",
    // used this instead of flex, it may be better to use flex
    display: "inline-block",
    position: "absolute",
    left: "331px",
    top: "161px",
    //
    margin: "auto",
    padding: 0,
    border: "6px solid black",
    borderRadius: "9px",
    fontFamily: "Inter, sans-serif",
  },
  titleContainer: {
    // read above
    display: "inline-block",
    position: "absolute",
    left: "203px",
    top: "97px",
    //
    fontSize: "60px",
    fontStyle: "normal",
    fontWeight: "700",
    height: "73px",
    width: "661px",
    float: "258px",
  },
  inputEmailAddress: {
    width: "784px",
    height: "95px",
    // read above
    display: "inline-block",
    position: "absolute",
    left: "128px",
    top: "258px",
    //
  },
  inputPassword: {
    width: "784px",
    height: "95px",
    // read above
    display: "inline-block",
    position: "absolute",
    left: "128px",
    top: "368px",
    //
  },
  inputBox: {
    color: "#000",
    height: "50px",
    width: "100%",
    border: "3px solid #000",
    borderRadius: "9px",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "30px",
  },
  textAboveInputBox: {
    // read above
    fontFamily: "Inter",
    display: "inline-block",
    position: "relative",
    left: "8px",
    //
    color: "#000",
    fontSize: "25px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
  },
  loginButton: {
    // read above
    display: "inline-block",
    position: "absolute",
    left: "428px",
    top: "508px",
    //
    color: "#000",
    fontSize: "30px",
    width: "211px",
    height: "65px",
    border: "3px solid #000",
    borderRadius: "9px",
    background: "white",
  },
  textAboveSignup: {
    // read above
    display: "inline-block",
    position: "absolute",
    left: "331px",
    top: "673px",
    //
    color: "#000",
    fontFamily: "Inter",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "400",
  },
  signupButton: {
    // read above
    display: "inline-block",
    position: "absolute",
    left: "461px",
    top: "714px",
    //
    width: "144px",
    height: "44px",
    fontFamily: "Inter",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "400",
    textDecoration: "none",
    textAlign: "center",
    background: "white",
    borderRadius: "9px",
    border: "3px solid black",
  },
  signupLink: {
    color: "#000",
    width: "144px",
    height: "44px",
  },
  errorLabel: {
    color: "red",
  },
};
