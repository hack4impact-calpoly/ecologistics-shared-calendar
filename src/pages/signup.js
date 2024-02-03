import Layout from "../components/layout";

export default function SignUp() {
  return (
    <Layout>
      <div style={styles.signupContainer}>
        <h1>Apply For an Account</h1>
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
          <input placeholder="Enter Your Password" style={styles.signUpInput} />
        </div>
        <button style={styles.signUpButton}>Sign Up</button>
        <br />
        <div style={styles.accountHaveContainer}>
          <p style={styles.accountHaveText}>
            Already Have an Account? Login Here!
          </p>
          <button style={styles.loginButton}>Login</button>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  signupContainer: {
    height: "55vh",
    width: "50vw",
    display: "inline-block",
    position: "absolute",
    padding: "0",
    border: "thick solid black",
    borderRadius: "1vh",
    left: "calc(50vw / 2)",
    textAlign: "center",
  },
  signUpInput: {
    color: "black",
    height: "3vh",
    width: "33vw",
    border: "thin solid black",
    borderRadius: "0.25vh",
  },
  inputTitle: {
    marginBottom: "0",
  },
};
