import Layout from "../components/layout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./style/signup.module.css"; // Make sure the path is correct

export default function SignUp() {
  const router = useRouter();

  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const goToLogin = () => {
    router.push("/login"); // Use Next.js router for navigation
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!organization || !email || !password) {
      alert("Please fill in all fields.");
    } else if (!email.includes("@")) {
      alert("Please enter a valid email address.");
    } else {
      router.push("/confirmation-page");
    }
  };

  return (
    <Layout>
      <style jsx>{`
        input::placeholder {
          color: grey;
        }
      `}</style>
      <div className={styles.container}>
        <form className={styles.formBox} onSubmit={handleSubmit}>
          <h2 className={styles.title}>Apply For an Account</h2>
          <p className={styles.subtitle}>Organizations & Charities Only</p>

          <div className={styles.inputBox}>
            <label htmlFor="organization" className={styles.label}>
              Name of Organization
            </label>
            <div className={styles.inputContainer}>
              <input
                type="text" // Changed to text for organization input
                id="organization"
                placeholder="Enter Organization Name"
                className={styles.input}
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputBox}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputContainer}>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email Address "
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputBox}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputContainer}>
              <input
                type="password"
                id="password"
                placeholder="Enter Your Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={`${styles.button} ${styles.buttonSent}`}>
            Sign Up
          </button>

          <div className={styles.bottomText}>
            Already Have an Account? <span onClick={goToLogin} style={{cursor: 'pointer', color: 'blue'}}>Login Here!</span>
          </div>

        </form>
      </div>
    </Layout>
  );
}
