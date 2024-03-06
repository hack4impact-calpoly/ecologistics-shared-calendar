import Layout from "../components/layout";
import React from "react";

export default function SignUp() {
  /*
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
              type="text"
              placeholder="Enter Your Email Address"
              style={{...styles.signUpInput, color: "black"}}
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
            <button style={styles.signupButton} type="submit"
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => ((e.target as HTMLButtonElement).style.backgroundColor = "#e69153")}
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => ((e.target as HTMLButtonElement).style.backgroundColor = "#f7ab74")}
            >
              <div style={styles.text}>
                  Sign Up
              </div>
            </button>
          </div>
        </div>
        <div style={styles.bottomContainer}>
          <p style={styles.accountHaveText}>
            Already Have an Account? Login Here!
          </p>
          <div style={styles.loginButtonContainer}>
            <button style={styles.loginButton} type="submit"
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#e69153"}
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.backgroundColor = "#f7ab74"}
            >
              <div style={styles.text}>
                  Login
              </div>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  */
  return (
    <Layout>
      <style jsx>{`
        input::placeholder {
          color: grey;
        }
      `}</style>
      <div style={styles.container}>
        <form style={styles.formBox}>
          <h2 style={styles.title}>Apply For an Account</h2>
          <p style={styles.subtitle}>Organizations & Charities Only</p>

          <div className="inputBox" style={styles.inputBox}>
            <label htmlFor="email" style={styles.label}>
              Name of Organization
            </label>
            <div style={styles.inputContainer}>
              <input
                type="text"
                id="text"
                placeholder="Enter Organization Name"
                style={styles.input}
                required
              />
            </div>
          </div>
          <div className="inputBox" style={styles.inputBox}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <div style={styles.inputContainer}>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email Address "
                style={styles.input}
                required
              />
            </div>
          </div>
          <div className="inputBox" style={styles.inputBox}>
            <label htmlFor="email" style={styles.label}>
              Password
            </label>
            <div style={styles.inputContainer}>
              <input
                type="password"
                id="password"
                placeholder="Enter Your Password"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={{ paddingTop: "1vw" }}></div>

          <button
            type="submit"
            style={{ ...styles.button, ...styles.buttonSent }}
          >
            {"Sign Up"}
          </button>

          <div style={styles.bottomText}>
            Already Have an Account? Login Here!
          </div>

          <button
            type="submit"
            style={{ ...styles.button, ...styles.buttonSent }}
          >
            {"Login"}
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
    padding: "0.23em",
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
  // contentWrapper, headerContainer, signupContainer, bottomContainer,  inputContainer, signUpInput, inputTitle, signupButtonContainer, signupButton, loginButtonContainer, loginButton, accountHaveText
};
