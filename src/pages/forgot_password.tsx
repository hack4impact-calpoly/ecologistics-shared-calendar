import React, { useState } from "react";
import Layout from "../components/layout";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSent(true);
        axios.post("/api/forgot_password", { email: email });
        setStatusMessage("Instructions have been sent to your email.");
        // Here, you'd also include the API call to actually send the email
    };

    return (
        <Layout>
            <div style={styles.container}>
                <form style={styles.formBox} onSubmit={handleSubmit}>
                    <h2 style={styles.title}>Forgot Your Password?</h2>
                    <p style={styles.subtitle}>
                        Enter your email and we will send you instructions to
                        reset your password
                    </p>

                    <div className="inputBox" style={styles.inputBox}>
                        <label htmlFor="email" style={styles.label}>
                            Email
                        </label>
                        <div style={styles.inputContainer}>
                            <EmailIcon style={styles.icon} />
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

                    <button
                        type="submit"
                        style={
                            sent
                                ? { ...styles.button, ...styles.buttonSent }
                                : styles.button
                        }
                        disabled={sent}
                    >
                        {sent ? "Sent" : "Submit"}
                    </button>

                    {statusMessage && (
                        <p style={styles.statusMessage}>{statusMessage}</p>
                    )}
                </form>
            </div>
        </Layout>
    );
}

const styles : { [key: string]: React.CSSProperties }= {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        backgroundColor: "white",
        padding: "20px",
    },
    formBox: {
        border: "1px solid black",
        padding: "40px",
        borderRadius: "8px",
        backgroundColor: "white",
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    title: {
        fontFamily: "Inter",
        fontSize: "2em",
        textAlign: "center",
        marginBottom: "10px",
    },
    subtitle: {
        fontFamily: "Inter",
        textAlign: "center",
        marginBottom: "20px",
    },
    inputBox: {
        marginTop: "20px",
        width: "100%",
        marginBottom: "40px",
    },
    label: {
        fontFamily: "Inter",
        fontSize: "0.5em",
        marginBottom: "4px",
        marginLeft: "3px",
    },
    inputContainer: {
        display: "flex",
        alignItems: "center",
        position: "relative",
    },
    icon: {
        position: "absolute",
        left: "10px",
    },
    input: {
        fontFamily: "Inter",
        padding: "15px",
        paddingLeft: "40px",
        fontSize: "1em",
        width: "100%",
        border: "1px solid black",
        borderRadius: "4px",
    },
    button: {
        padding: "15px 20px",
        fontSize: "1em",
        color: "black",
        backgroundColor: "white",
        border: "1px solid black",
        borderRadius: "4px",
        width: "50%",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    buttonSent: {
        backgroundColor: "green",
    },
    statusMessage: {
        fontFamily: "Inter",
        textAlign: "center",
        marginTop: "20px",
        fontSize: "1em",
        color: "#28a745",
    },
};
