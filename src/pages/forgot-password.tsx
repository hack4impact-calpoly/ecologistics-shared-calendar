import React, { useState } from "react";
import Layout from "../components/layout";
import { useRouter } from "next/router";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useSession } from "@clerk/nextjs";
import styles from "./style/forgot-password.module.css"; // Make sure the path is correct

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [passwordValidation, setPasswordValidation] = useState("");

    const handleChange = (event: {
        target: { value: React.SetStateAction<string> };
    }) => {
        setEmail(event.target.value);
    };

    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [secondFactor, setSecondFactor] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { isLoaded, signIn, setActive } = useSignIn();
    const { session } = useSession();

    if (!isLoaded) {
        return null;
    }

    // If the user is already signed in,
    // redirect them to the home page
    if (isSignedIn) {
        //router.push("/");
    }

    // Send the password reset code to the user's email
    async function create(e: React.FormEvent) {
        e.preventDefault();

        try {
            // End existing session if any
            if (session) {
                await session.end();
            }

            await signIn?.create({
                strategy: "reset_password_email_code",
                identifier: email,
            });

            setSuccessfulCreation(true);
            setError("");
        } catch (err: any) {
            console.error("error", err.errors[0].longMessage);
            setError(err.errors[0].longMessage);
        }
    }
    // Reset the user's password.
    // Upon successful reset, the user will be
    // signed in and redirected to the home page
    async function reset(e: React.FormEvent) {
        e.preventDefault();

        // Reset password validation message
        setPasswordValidation("");

        // Password length validation
        if (password.length < 8) {
            setPasswordValidation(
                "Password must be at least 8 characters long."
            );
            return;
        }

        await signIn
            ?.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code,
                password,
            })
            .then((result) => {
                // Check if 2FA is required
                if (result.status === "needs_second_factor") {
                    setSecondFactor(true);
                    setError("");
                } else if (result.status === "complete") {
                    // Set the active session to
                    // the newly created session (user is now signed in)
                    setActive({ session: result.createdSessionId });
                    router.push("/login");
                } else {
                    console.log(result);
                }
            })
            .catch((err) => {
                console.error("error", err.errors[0].longMessage);
                setError(err.errors[0].longMessage);
            });
    }

    return (
        <Layout>
            <style jsx>{`
                input::placeholder {
                    color: grey;
                }
            `}</style>

            <div className={styles.container}>
                <h2 className={styles.title}>Forgot Your Password?</h2>
                <p className={styles.subtitle}>
                    Organizations & Charities Only
                </p>

                <form
                    className={styles.formBox}
                    onSubmit={!successfulCreation ? create : reset}
                >
                    {!successfulCreation && (
                        <>
                            <div className={styles.inputBox}>
                                <label htmlFor="email" className={styles.label}>
                                    Email Address
                                </label>
                                <div className={styles.inputContainer}>
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
                            </div>

                            <div className={styles.bottomText}>
                                Enter your email to reset your password!
                            </div>

                            <button
                                type="submit"
                                className={
                                    sent
                                        ? `${styles.button}
                                              ${styles.buttonSent}
                                          `
                                        : styles.button
                                }
                                disabled={sent}
                            >
                                {sent ? "Sent" : "Reset Password"}
                            </button>
                        </>
                    )}
                    {successfulCreation && (
                        <>
                            <div className={styles.inputBox}>
                                <label
                                    htmlFor="password"
                                    className={styles.label}
                                >
                                    Enter your new password
                                </label>
                                <div className={styles.inputContainer}>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        } // Toggle password visibility
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className={styles.input}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        } // Toggle the state on button click
                                        className={styles.togglePasswordButton}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {passwordValidation && (
                                    <p className={styles.passwordValidation}>
                                        {passwordValidation}
                                    </p>
                                )}
                                <label htmlFor="code" className={styles.label}>
                                    Enter the password reset code that was sent
                                    to your email
                                </label>
                                <div className={styles.inputContainer}>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                            <button className={styles.button}>Reset</button>
                            {error && <p>{error}</p>}
                        </>
                    )}
                </form>
            </div>
        </Layout>
    );
}
