import React, { useState } from "react";
import Layout from "../components/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./style/login.module.css";
//icons
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/LockOutlined";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const goToSignUp = () => {
    router.push("/signup");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    router.push("/calendar");
  };

  return (
    <Layout>
      <div className={styles.container}>
        <form className={styles.formBox} onSubmit={handleSubmit}>
          <h2 className={styles.title}>Login To Your Account</h2>
          <p className={styles.subtitle}>Organizations & Charities Only</p>

          <div className={styles.inputBox}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputContainer}>
              <PersonIcon className={styles.icon} />
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email Address"
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
              <LockIcon className={styles.icon} />
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

          <button
            className={`${styles.button} ${styles.buttonSent}`}
            type="submit"
          >
            Login
          </button>

          <div className={styles.bottomText}>
            <Link href="/forgot_password">Forgot Password?</Link>
          </div>

          <div className={styles.bottomText}>
            Don't Have an Account? Apply for one now!
          </div>

          <button
            className={`${styles.button} ${styles.buttonSent}`}
            onClick={goToSignUp}
          >
            Sign Up
          </button>
        </form>
      </div>
    </Layout>
  );
}
