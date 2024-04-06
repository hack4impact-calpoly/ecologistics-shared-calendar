import Layout from "../components/layout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSignUp } from "@clerk/nextjs";

export default function SignUp() {
    const router = useRouter();
    const { signUp } = useSignUp();

    const [organization, setOrganization] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const goToLogin = () => {
        window.location.href = "/login";
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!organization || !email || !password) {
            alert("Please fill in all fields.");
            return;
        } else if (!email.includes("@")) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            console.log("Registration Info:", email, password, organization);
            // Call signUp.create to create a new user with Clerk
            const res = await signUp.create({
                emailAddress: email,
                password: password,
                unsafeMetadata: {
                    organization,
                    role: "pending",
                },
            });
            console.log("Mid");
            const result = await signUp.prepareEmailAddressVerification({
                strategy: "email_link",
                redirectUrl:
                    "https://ecologistics-shared-calendar-glwqmahi3.vercel.app/",
            });

            // Redirect to confirmation page after successful sign-up
            router.push("/confirmation-page");
        } catch (error) {
            console.error("Error signing up:", error);
            alert("An error occurred. Please try again later.");
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
                                onChange={(e) => setPassword(e.target.value)}
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
