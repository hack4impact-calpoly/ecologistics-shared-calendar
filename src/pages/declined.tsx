import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserDocument } from "../database/userSchema";
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/router";

const ConfirmationPage: React.FC = () => {
    const { signOut } = useClerk();
    const router = useRouter();
    const handleReturn = async () => {
        router.push("/");
    };

    const [user, setUser] = useState<UserDocument>();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/userRoutes");
                const user_data = response.data.data as UserDocument;
                setUser(user_data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    width: "25vw",
                }}
            >
                <h2 style={{ textAlign: "center" }}>
                    Your Account Request was Rejected
                </h2>
                <p>
                    Rejection Message: {user?.declineMessage || "No details."}
                </p>
                {/* Button to return to the specified page */}
                <button style={styles.button} onClick={handleReturn}>
                    Go to Calendar
                </button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    button: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "1em",
        marginTop: "1em",
        color: "black",
        paddingTop: "0.7em",
        paddingBottom: "0.7em",
        backgroundColor: "#f7ab74",
        border: "none",
        borderRadius: "10px",
        width: "40%",
        cursor: "pointer",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    },
};

export default ConfirmationPage;
