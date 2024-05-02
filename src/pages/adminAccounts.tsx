import AccountsTable from "../admin_components/AccountsRequestTable";
import Layout from "../components/layout";
import React, { useState, useEffect } from "react";

const pending = [
    {
        id: 1,
        name: "AAPI SLO 1",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 2,
        name: "AAPI SLO 2",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 3,
        name: "AAPI SLO 3",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 4,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 5,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 6,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 7,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 8,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 9,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 10,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 11,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 12,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Pending",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    // ... other requests come after
];

const approved = [
    {
        id: 1,
        name: "AAPI SLO 1",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 2,
        name: "AAPI SLO 2",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 3,
        name: "AAPI SLO 3",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 4,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 5,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 6,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 7,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 8,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 9,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 10,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 11,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 12,
        name: "AAPI SLO",
        email: "aapislo@gmail.com",
        status: "Approved",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    // ... other requests come after
];

const declined = [
    {
        id: 1,
        name: "AAPI SLO 1",
        email: "aapislo@gmail.com",
        status: "Declined",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 2,
        name: "AAPI SLO 2",
        email: "aapislo@gmail.com",
        status: "Declined",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
    {
        id: 3,
        name: "AAPI SLO 3",
        email: "aapislo@gmail.com",
        status: "Declined",
        date: "10/02/2023",
        time: "1:00pm-2:30pm",
        description: "lorem ipsum nfeoigioehge...",
    },
];

export default function AdminRequestTable() {
    const [users, setUsers] = useState([]);
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

    const pendingUsers = users.filter((user) => user.role === "pending");
    const approvedUsers = users.filter((user) => user.role === "approved");
    const declinedUsers = users.filter((user) => user.role === "denied");

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
