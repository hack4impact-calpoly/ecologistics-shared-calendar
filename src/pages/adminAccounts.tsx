import AccountsTable from "../admin_components/AccountsRequestTable";
import Layout from "../components/layout";
import React, { useState, useEffect } from "react";
import { UserDocument } from "../database/userSchema";
import axios from "axios";

export default function AdminRequestTable() {
    const [users, setUsers] = useState<UserDocument[]>([]);
    useEffect(() => {
        // Define a function to fetch users from the API endpoint
        const fetchUsers = async () => {
            try {
                // Fetch data from the API endpoint
                const response = await fetch("/api/userRoutes");
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                // Extract JSON data from the response
                const body = await response.json();
                // Update the users state with the retrieved data
                setUsers(body?.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        // Call the fetchUsers function when the component mounts
        fetchUsers();
    }, []); // Empty dependency array to ensure the effect runs only once

    const approveUser = async (id: any) => {
        /*
        Approves user in clerk/mongodb and updates state
        :param id: user mongo id
        */
        try {
            //axios patch to update role
            await axios.patch(`/api/users/${id}`, {
                role: "approved",
            });
            // Update the role in the user state variable
            const updatedUsers = users.map((user) => {
                if (user._id === id) {
                    return { ...user, role: "approved" };
                }
                return user;
            });
            setUsers(updatedUsers);
        } catch (err) {
            console.error(err);
        }
    };
    const declineUser = async (id: any) => {
        /*
        Approves user in clerk/mongodb and updates state
        :param id: user mongo id
        */
        try {
            //axios patch to update role
            await axios.patch(`/api/users/${id}`, {
                role: "approved",
            });
            // Update the role in the user state variable
            const updatedUsers = users.map((user) => {
                if (user._id === id) {
                    return { ...user, role: "declined" };
                }
                return user;
            });
            setUsers(updatedUsers);
        } catch (err) {
            console.error(err);
        }
    };

    const pendingUsers = users.filter((user) => user.role === "pending");
    const approvedUsers = users.filter((user) => user.role === "approved");
    const declinedUsers = users.filter((user) => user.role === "declined");

    return (
        <Layout>
            {/* Requested Accounts */}
            <div style={styles.container}>
                <div>
                    <h1 style={{ alignSelf: "flex-start" }}>Inbox</h1>
                    <div
                        style={{ height: "0.35714rem", background: "#F07F2D" }}
                    ></div>
                    <h3>Requested Accounts</h3>
                    <AccountsTable ITEMS_PER_PAGE={4} events={pendingUsers} />
                </div>
                {/* Approved Accounts */}
                <div>
                    <h1 style={{ alignSelf: "flex-start" }}>Active Accounts</h1>
                    <div
                        style={{
                            height: "0.35714rem",
                            background: "#F07F2D",
                        }}
                    ></div>
                    <h3>Approved Accounts</h3>
                    <AccountsTable ITEMS_PER_PAGE={1} events={approvedUsers} />
                </div>

                {/* Declined Accounts */}
                <div>
                    <h3>Declined Accounts</h3>
                    <AccountsTable ITEMS_PER_PAGE={1} events={declinedUsers} />
                </div>
            </div>
        </Layout>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
};
