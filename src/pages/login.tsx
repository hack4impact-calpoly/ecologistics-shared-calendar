import React, { useState, ChangeEvent, FormEvent } from "react";
import Layout from "../components/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSignIn, useSession } from "@clerk/nextjs";
import styles from "./style/login.module.css"; // Make sure the path is correct

// Icons
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/LockOutlined";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const { isLoaded, signIn, setActive } = useSignIn();
    const { session } = useSession();

    if (!isLoaded) {
        return null;
    }

    const goToSignUp = () => {
        window.location.href = "/signup";
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!email.includes("@")) {
            alert("Please enter a valid email address.");
            return;
        }
        try {
            //delete previous session if user was alread logged in
            if (session) {
                await session.end();
            }

            //sign in to clerk
            const result = await signIn.create({
                identifier: email,
                password,
            });

            //create session
            if (result.status === "complete") {
                await setActive({
                    session: result.createdSessionId,
                });
                //redirect based on role
                const role = session?.user?.publicMetadata?.role;
                if (role === "pending") router.push("/confirmation-page");
                else if (role === "admin" || role === "user")
                    router.push("/calendar");
            } else {
                console.log(result);
            }
        } catch (err: any) {
            console.error(err);
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
                    <h2 className={styles.title}>Login To Your Account</h2>
                    <p className={styles.subtitle}>
                        Organizations & Charities Only
                    </p>

                    <div className={styles.inputBox}>
                        <label htmlFor="email" className={styles.label}>
                            Email Address
                        </label>

                        <div className={styles.inputContainer}>
                            <PersonIcon className={styles.icon}></PersonIcon>
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
                        <label htmlFor="email" className={styles.label}>
                            Password
                        </label>

                        <div className={styles.inputContainer}>
                            <LockIcon className={styles.icon}></LockIcon>
                            <input
                                type={showPassword ? "text" : "password"} // Toggle password visibility
                                id="email"
                                placeholder="Enter Your Password"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)} // Toggle the state on button click
                                className={styles.togglePasswordButton}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div style={{ paddingTop: "1vw" }}></div>

                    <button
                        type="submit"
                        className={`${styles.button} ${styles.buttonSent}`}
                    >
                        {"Login"}
                    </button>

                    <div className={styles.bottomText}>
                        <Link href="/forgot-password">Forgot Password?</Link>
                    </div>

                    <div className={styles.bottomText}>
                        Don&apos;t Have an Account? Apply for one now!
                    </div>

                    <button
                        type="submit"
                        className={`${styles.button} ${styles.buttonSent}`}
                        onClick={goToSignUp}
                    >
                        {"Sign Up"}
                    </button>
                </form>
            </div>
        </Layout>
    );
}
