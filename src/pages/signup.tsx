import Layout from "../components/layout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSignUp } from "@clerk/nextjs";
import axios from "axios";

export default function SignUp() {
    const router = useRouter();
    const { signUp, isLoaded, setActive } = useSignUp();

    const [organization, setOrganization] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");

    const goToLogin = () => {
        window.location.href = "/login";
    };

    const handleChange = (e) => {
        // Ensure only numeric input and maximum length of 6 digits
        const newCode = e.target.value.replace(/\D/g, "").slice(0, 6);
        setCode(newCode);
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                emailAddress: email,
                password: password,
                unsafeMetadata: {
                    organization,
                    role: "pending",
                },
            });

            // send the email.
            const result = await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            // change the UI to our pending section.
            setPendingVerification(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    const onPressVerify = async (e) => {
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
                /*  investigate the response, to see if there was an error
        or if the user needs to complete more steps.*/
                console.log(JSON.stringify(completeSignUp, null, 2));
            }
            if (completeSignUp.status === "complete") {
                await setActive({
                    session: completeSignUp.createdSessionId,
                });
                console.log("session made");
                //create user in DB
                await axios.post("/api/userRoutes", {
                    email: email,
                    role: "pending",
                    organization: organization,
                });

                await router.push("/confirmation-page");

                // TODO: create user in MONGODB
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
                                    type="password"
                                    id="password"
                                    placeholder="Enter Your Password"
                                    style={styles.input}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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
};
