import React, { useState } from 'react';
import Layout from "../components/layout";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSent(true);
        setStatusMessage('Instructions have been sent to your email.');
    }

    return (
        <Layout>
            <div style={styles.container}>
                <form style={styles.formBox} onSubmit={handleSubmit}>
                    <h2 style={styles.title}>Forgot Your Password?</h2>
                    <p style={styles.subtitle}>Enter your email and we will send you instructions to reset your password</p>
                    <input
                        type="email"
                        placeholder="Enter Your Email Address"
                        style={styles.input}
                        value={email}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                        style={sent ? { ...styles.button, ...styles.buttonSent } : styles.button}
                        disabled={sent}
                    >
                        {sent ? "Sent" : "Submit"}
                    </button>
                    {statusMessage && <p style={styles.statusMessage}>{statusMessage}</p>}
                </form>
            </div>
        </Layout>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        backgroundColor: 'white',
        padding: '20px',
    },
    formBox: {
        border: '1px solid black',
        padding: '40px',
        borderRadius: '8px',
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        padding: '15px',
        width: '100%',
        margin: '10px 0',
        boxSizing: 'border-box',
        border: '1px solid black',
        borderRadius: '4px',
    },
    button: {
        marginTop: '20px',
        padding: '15px 20px',
        fontSize: '1em',
        color: 'white',
        backgroundColor: 'blue',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'background-color 0.3s',
    },
    buttonSent: {
        backgroundColor: 'green',
    },
    title: {
        fontSize: '1.5em',
        textAlign: 'center',
        margin: '0 0 20px 0',
    },
    subtitle: {
        fontSize: '1em',
        textAlign: 'center',
        marginBottom: '20px',
    },
    statusMessage: {
        color: 'green',
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '1em',
    },
};
