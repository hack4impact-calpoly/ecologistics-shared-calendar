import Layout from "../components/layout";

export default function SignUp() {
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
            <button style={styles.signupButton} type="submit">
              Sign Up
            </button>
          </div>
        </div>
        <div style={styles.bottomContainer}>
          <p style={styles.accountHaveText}>
            Already Have an Account? Login Here!
          </p>
          <div style={styles.loginButtonContainer}>
            <button style={styles.loginButton} type="submit">Login</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  // contentWrapper, headerContainer, signupContainer, bottomContainer,  inputContainer, signUpInput, inputTitle, signupButtonContainer, signupButton, loginButtonContainer, loginButton, accountHaveText
  contentWrapper: {
    // fontSize: "xxx-large",
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
  title: {
    fontSize: "xxx-large",
    fontWeight: "700",
    margin: 0
  },
  subtitle: {
    fontSize: "x-large",
    margin: 0
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
    padding: "0 0 0 2vw",
    border: "1px solid #000",
    borderRadius: "9px",
    fontSize: "large",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    height: "5.5vh"
  },
  inputTitle: {
    fontSize: "medium",
    marginBottom: "0"
  },
  signupButtonContainer: {
    height: "16%",
    width: "20%",
  },
  signupButton: {
    fontSize: "larger",
    width: "100%",
    height: "100%",
    border: "3px solid #000",
    borderRadius: "9px",
    background: "white",
    marginTop: "1vh",
  },
  loginButtonContainer: {
    height: "20%",
    width: "14%",
    margin: "0 0 3vh 0",
    display: "flex",
    justifyContent: "center"
  },
  loginButton: {
    height: "100%",
    width: "75%",
    textDecoration: "none",
    textAlign: "center",
    background: "white",
    borderRadius: "9px",
    border: "3px solid black",
  },
  accountHaveText: {
    height: "11%",
    margin: "1vh",
  },
};
