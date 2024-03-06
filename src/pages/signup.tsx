import Layout from "../components/layout";
import React from "react";

export default function SignUp() {
  const goToConfirm = () => {
    window.location.href = "/confirmation-page";
  };
  const goToLogin = () => {
    window.location.href = "/login";
  };
  return (
    <Layout>
      <div style={styles.contentWrapper}>
        <div style={styles.headerContainer}>
          <h1 style={styles.title}>Apply For an Account</h1>
          <p style={styles.subtitle}>Organizations & Charities Only</p>
        </div>
        <div style={styles.signupContainer}>
          <div style={styles.inputContainer}>
            <p style={styles.inputTitle}>Name of Organization:</p>
            <input
              placeholder="Enter Organization Name"
              style={styles.signUpInput}
            />
          </div>
          <div style={styles.inputContainer}>
            <p style={styles.inputTitle}>Email Address:</p>
            <input
              placeholder="Enter Your Email Address"
              style={styles.signUpInput}
            />
          </div>
          <div style={styles.inputContainer}>
            <p style={styles.inputTitle}>Password:</p>
            <input
              placeholder="Enter Your Password"
              style={styles.signUpInput}
            />
          </div>

          <div style={styles.signupButtonContainer}>
            <button
              onClick={goToConfirm}
              style={styles.signupButton}
              type="submit"
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "#e69153")
              }
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "#f7ab74")
              }
            >
              Sign Up
            </button>
          </div>
        </div>
        <div style={styles.bottomContainer}>
          <p style={styles.accountHaveText}>
            Already Have an Account? Login Here!
          </p>
          <div style={styles.loginButtonContainer}>
            <button
              onClick={goToLogin}
              style={styles.loginButton}
              type="submit"
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "#e69153")
              }
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "#f7ab74")
              }
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  // contentWrapper, headerContainer, signupContainer, bottomContainer,  inputContainer, signUpInput, inputTitle, signupButtonContainer, signupButton, loginButtonContainer, loginButton, accountHaveText
  contentWrapper: {
    // fontSize: "xxx-large",
    fontFamily: "DM Sans, sans-serif",
    display: "flex",
    flexDirection: "column",
    width: "61vw",
    fontWeight: "400",
    height: "73vh",
    alignItems: "stretch",
    justifyContent: "start",
    margin: "10vh auto 10vh auto",
    padding: 0,
    border: "1px solid black",
    borderRadius: "9px",
  },
  title: {
    fontSize: "xxx-large",
    fontWeight: "700",
    margin: 0,
  },
  subtitle: {
    fontSize: "x-large",
    margin: 0,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "25%",
    justifyContent: "flex-end",
  },
  signupContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "50%",
    justifyContent: "flex-start",
  },
  bottomContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "23%",
    justifyContent: "flex-end",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    height: "28%",
    width: "73%",
  },
  signUpInput: {
    padding: "0 0 0 1vw",
    border: "1px solid #000",
    borderRadius: "9px",
    color: "black",
    fontSize: "x-large",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    height: "5.5vh",
  },
  inputTitle: {
    fontSize: "large",
    marginBottom: "0",
  },
  signupButtonContainer: {
    height: "16%",
    width: "15%",
  },
  signupButton: {
    fontWeight: "500",
    width: "100%",
    height: "75%",
    marginTop: "1vh",
    background: "#f7ab74",
    borderRadius: "9px",
    border: "0px",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    cursor: "pointer",
  },
  loginButtonContainer: {
    height: "20%",
    width: "20%",
    margin: "0 0 3vh 0",
    display: "flex",
    justifyContent: "center",
  },
  loginButton: {
    height: "100%",
    fontWeight: "500",
    width: "75%",
    textDecoration: "none",
    textAlign: "center",
    background: "#f7ab74",
    borderRadius: "9px",
    border: "0px",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    cursor: "pointer",
  },
  accountHaveText: {
    height: "11%",
    margin: "1vh",
  },
};
