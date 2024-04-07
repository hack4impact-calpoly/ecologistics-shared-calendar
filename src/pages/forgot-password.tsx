import React, { useState } from "react";
import Layout from "../components/layout";
//import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import { useRouter } from "next/router";
import { useSignIn, useAuth } from "@clerk/nextjs";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

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

    if (!isLoaded) {
        return null;
    }

    // If the user is already signed in,
    // redirect them to the home page
    if (isSignedIn) {
        router.push("/");
    }

    // Send the password reset code to the user's email
    async function create(e: React.FormEvent) {
        e.preventDefault();
        await signIn
            ?.create({
                strategy: "reset_password_email_code",
                identifier: email,
            })
            .then((_) => {
                setSuccessfulCreation(true);
                setError("");
            })
            .catch((err) => {
                console.error("error", err.errors[0].longMessage);
                setError(err.errors[0].longMessage);
            });
    }
    // Reset the user's password.
    // Upon successful reset, the user will be
    // signed in and redirected to the home page
    async function reset(e: React.FormEvent) {
        e.preventDefault();
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
                    setError("");
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

            <div style={styles.container}>
                <h2 style={styles.title}>Forgot Your Password?</h2>
                <p style={styles.subtitle}>Organizations & Charities Only</p>

                <form
                    style={styles.formBox}
                    onSubmit={!successfulCreation ? create : reset}
                >
                    {!successfulCreation && (
                        <>
                            <div className="inputBox" style={styles.inputBox}>
                                <label htmlFor="email" style={styles.label}>
                                    Email Address
                                </label>
                                <div style={styles.inputContainer}>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter Your Email Address"
                                        style={styles.input}
                                        value={email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={styles.bottomText}>
                                Enter your email to reset your password!
                            </div>

                            <button
                                type="submit"
                                style={
                                    sent
                                        ? {
                                              ...styles.button,
                                              ...styles.buttonSent,
                                          }
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
                            <div className="inputBox" style={styles.inputBox}>
                                <label htmlFor="password" style={styles.label}>
                                    Enter your new password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    style={styles.input}
                                />
                                <label htmlFor="code" style={styles.label}>
                                    Enter the password reset code that was sent
                                    to your email
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    style={styles.input}
                                />
                            </div>
                            <button style={styles.button}>Reset</button>
                            {error && <p>{error}</p>}
                        </>
                    )}
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
        padding: "0.3em",
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
};
