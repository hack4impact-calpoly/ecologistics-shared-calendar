import Layout from "../components/layout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSignUp, useSession } from "@clerk/nextjs";
import axios from "axios";

export default function SignUp() {
    const router = useRouter();
    const { signUp, isLoaded, setActive } = useSignUp();
    const { session } = useSession();

    const [organization, setOrganization] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordValidation, setPasswordValidation] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");

    const goToLogin = () => {
        window.location.href = "/login";
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!isLoaded) {
            return;
        }
        // Reset password validation message
        setPasswordValidation("");

        // Password length validation
        if (password.length < 8) {
            setPasswordValidation(
                "Password must be at least 8 characters long."
            );
            return;
        }

        try {
            //delete previous session if user was alread logged in
            if (session) {
                await session.end();
            }

            await signUp.create({
                emailAddress: email,
                password: password,
                unsafeMetadata: {
                    organization,
                    role: "pending",
                },
            });

            // send the email.
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            // change the UI to our pending section.
            setPendingVerification(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    const onPressVerify = async (e: any) => {
        /*
        Verifies confirmation code
        */
        e.preventDefault();
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification(
                {
                    code,
                }
            );
            if (completeSignUp.status !== "complete") {
                console.log(JSON.stringify(completeSignUp, null, 2));
            }

            //if successfully created clerk user, create in local db
            if (completeSignUp.status === "complete") {
                await setActive({
                    session: completeSignUp.createdSessionId,
                });
                //create user in DB
                await axios.post("/api/userRoutes", {
                    email: email,
                    organization: organization,
                });

                await router.push("/confirmation-page");
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    };
    return (
        <Layout>
            <style jsx>{`
                input::placeholder {
                    color: grey;
                }
            `}</style>
            <div style={styles.container}>
                {!pendingVerification && (
                    <form style={styles.formBox} onSubmit={handleSubmit}>
                        <h2 style={styles.title}>Apply For an Account</h2>
                        <p style={styles.subtitle}>
                            Organizations & Charities Only
                        </p>

                        <div className="inputBox" style={styles.inputBox}>
                            <label htmlFor="email" style={styles.label}>
                                Name of Organization
                            </label>
                            <div style={styles.inputContainer}>
                                <input
                                    type="organization"
                                    id="organization"
                                    placeholder="Enter Organization Name"
                                    style={styles.input}
                                    value={organization}
                                    onChange={(e) =>
                                        setOrganization(e.target.value)
                                    }
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    type={showPassword ? "text" : "password"} // Toggle input type between "text" and "password"
                                    id="password"
                                    placeholder="Enter Your Password"
                                    style={styles.input}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    } // Toggle the state on button click
                                    style={styles.togglePasswordButton}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {passwordValidation && (
                                <p style={styles.passwordValidation}>
                                    {passwordValidation}
                                </p>
                            )}
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
                            onClick={goToLogin}
                        >
                            {"Login"}
                        </button>
                    </form>
                )}
                {pendingVerification && (
                    <div>
                        <form>
                            <input
                                value={code}
                                placeholder="Code..."
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <button onClick={onPressVerify}>
                                Verify Email
                            </button>
                        </form>
                        <p>
                            Enter 6 digit code sent to email address: {email}.
                        </p>
                    </div>
                )}
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
    togglePasswordButton: {
        fontFamily: "DM Sans",
        fontSize: "1em",
        color: "gray",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        outline: "none",
        position: "absolute",
        right: "5px", // Adjust the position of the button as needed
        top: "50%",
        transform: "translateY(-50%)",
    },
    inputContainer: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
    },
    // Add the passwordValidation style to your styles object:
    passwordValidation: {
        fontFamily: "DM Sans",
        fontSize: "0.8em",
        color: "red",
        marginTop: "0.5em",
        textAlign: "left",
    },
};
