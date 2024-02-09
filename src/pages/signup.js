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
    // height: "55vh",
    // width: "45vw",
    display: "inline-block",
    position: "absolute",
    padding: "2vw",
    border: "thick solid black",
    borderRadius: "1vh",
    left: "calc(50vw / 2)",
    textAlign: "center",
  },
  inputContainer: {
    marginLeft: "2vw",
    marginRight: "2vw"
  },
  signUpInput: {
    color: "black",
    height: "3vh",
    width: "27vw",
    border: "thin solid black",
    borderRadius: "0.25vh",
  },
  inputTitle: {
    marginBottom: "0",
    textAlign: "left"
  },
  loginButton: {
    border: "mediun solid black",
    borderRadius: "0.5vh",
    background: "white",
    height: "3vh",
    width: "7vh",
  },
  signUpButton: {
    margin: ".5vw",
    border: "mediun solid black",
    borderRadius: "0.5vh",
    background: "white",
    height: "4vh",
    width: "10vh",
    fontSize: "medium"
  },
};
