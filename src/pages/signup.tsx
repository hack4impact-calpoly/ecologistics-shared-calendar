import Layout from "../components/layout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSignUp, useSession } from "@clerk/nextjs";
import axios from "axios";
import styles from "./style/signup.module.css"; // Make sure the path is correct

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
        router.push("/login"); // Use Next.js router for navigation
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
            <div className={styles.container}>
                {!pendingVerification && (
                    <form className={styles.formBox} onSubmit={handleSubmit}>
                        <h2 className={styles.title}>Apply For an Account</h2>
                        <p className={styles.subtitle}>
                            Organizations & Charities Only
                        </p>

                        <div className={styles.inputBox}>
                            <label htmlFor="email" className={styles.label}>
                                Name of Organization
                            </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="organization"
                                    id="organization"
                                    placeholder="Enter Organization Name"
                                    className={styles.input}
                                    value={organization}
                                    onChange={(e) =>
                                        setOrganization(e.target.value)
                                    }
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
                            <label htmlFor="email" className={styles.label}>
                                Password
                            </label>
                            <div className={styles.inputContainer}>
                                <input
                                    type={showPassword ? "text" : "password"} // Toggle input type between "text" and "password"
                                    id="password"
                                    placeholder="Enter Your Password"
                                    className={styles.input}
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
                        </div>

                        <div style={{ paddingTop: "1vw" }}></div>

                        <button
                            type="submit"
                            className={`${styles.button} ${styles.buttonSent}`}
                        >
                            {"Sign Up"}
                        </button>

                        <div className={styles.bottomText}>
                            Already Have an Account? Login Here!
                        </div>

                        <button
                            type="submit"
                            className={`${styles.button} ${styles.buttonSent}`}
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
