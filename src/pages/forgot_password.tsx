import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import styles from "./style/forgot_password.module.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: { preventDefault: () => void }): void => {
    event.preventDefault();
    setSent(true);
    setIsError(false);
    axios
      .post("/api/forgot_password", { email: email })
      .then((response) => {
        setStatusMessage("Instructions have been sent to your email.");
      })
      .catch((error) => {
        setStatusMessage("An error occurred. Please try again.");
        setIsError(true);
      });
  };

  console.log(isError);
  return (
    <div className={styles.container}>
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Forgot Your Password?</h2>
        <p className={styles.subtitle}>Organizations & Charities Only</p>

        <div className={styles.inputBox}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter Your Email Address"
            className={styles.input}
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.bottomText}>
          Enter your email to reset your password!
        </div>

        <button
          type="submit"
          className={`${styles.button} ${sent ? styles.buttonSent : ""}`}
          disabled={sent}
        >
          {sent ? "Sent" : "Reset Password"}
        </button>

        {statusMessage && (
          <p
            className={`${styles.statusMessage} ${
              isError ? styles.errorMessage : ""
            }`}
          >
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
