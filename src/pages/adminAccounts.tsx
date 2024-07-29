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
        const response = await fetch("/api/admins/userRoutes");
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

  const approveUser = async (id: string) => {
    /*
        Approves user in clerk/mongodb and updates state
        :param id: user mongo id
        */
    try {
      //axios patch to update role
      await axios.patch(`/api/admins/users/${id}`, {
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

      const user = users.find((user) => user._id === id);
      if (user) {
        // send email telling org they've been approved
        await fetch("/api/sendGrid/orgRoutes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailAddress: user?.email,
            firstName: user?.firstName,
            orgName: user?.organization,
            templateId: "d-47bfcca8bafb4eeda0408372ca72084a",
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data); // Handle success response
          })
          .catch((error) => {
            console.error("Error:", error); // Handle error
          });
      }
    } catch (err) {
      console.error(err);
    }
  };
  const declineUser = async (id: string, message: string) => {
    /*
        Approves user in clerk/mongodb and updates state
        :param id: user mongo id
        */
    try {
      //axios patch to update role
      await axios.patch(`/api/admins/users/${id}`, {
        role: "declined",
        declineMessage: message,
      });
      // Update the role in the user state variable
      const updatedUsers = users.map((user) => {
        if (user._id === id) {
          return { ...user, role: "declined" };
        }
        return user;
      });
      setUsers(updatedUsers);

      const user = users.find((user) => user._id === id);
      if (user) {
        // send email telling org they've been denied
        await fetch("/api/sendGrid/orgRoutes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailAddress: user?.email,
            firstName: user?.firstName,
            orgName: user?.organization,
            deniedReason: message,
            templateId: "d-d62f3913815740519a71dee0084f6cfc",
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data); // Handle success response
          })
          .catch((error) => {
            console.error("Error:", error); // Handle error
          });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id: string) => {
    /*
        Deletes user rom mongo and clerk if trash button clicked
        :param id: user to delete's mongo _id
        */
    try {
      await axios.delete(`/api/admins/users/${id}`);
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
                <div style={{ width: "90%" }}>
                    <h1 style={{ alignSelf: "flex-start" }}>Inbox</h1>
                    <div
                        style={{ height: "0.35714rem", background: "#F07F2D" }}
                    ></div>
                    <h3>Requested Accounts</h3>

                    {pendingUsers.length == 0 ? <p style={{textAlign: "center"}}>No Requests Yet</p> : 
                    <AccountsTable
                        ITEMS_PER_PAGE={4}
                        events={pendingUsers}
                        approveUser={approveUser}
                        declineUser={declineUser}
                        deleteUser={deleteUser}
                    />} 
                </div>

                {/* Approved Accounts */}
                <div style={{ width: "90%" }}>
                    <h1 style={{ alignSelf: "flex-start" }}>Active Accounts</h1>
                    <div
                        style={{
                            height: "0.35714rem",
                            background: "#F07F2D",
                        }}
                    ></div>
                    <h3>Approved Accounts</h3>

                    {approvedUsers.length == 0 ? <p style={{textAlign: "center"}}>No Accounts Yet</p> : 
                    <AccountsTable
                        ITEMS_PER_PAGE={1}
                        events={approvedUsers}
                        approveUser={approveUser}
                        declineUser={declineUser}
                        deleteUser={deleteUser}
                    />}
                    
                </div>

                {/* Declined Accounts */}
                <div style={{ width: "90%" }}>
                    <h3>Declined Accounts</h3>
                    

                    {declinedUsers.length == 0 ? <p style={{textAlign: "center"}}>No Accounts Yet</p> : 
                    <AccountsTable
                        ITEMS_PER_PAGE={1}
                        events={declinedUsers}
                        approveUser={approveUser}
                        declineUser={declineUser}
                        deleteUser={deleteUser}
                    />}
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
