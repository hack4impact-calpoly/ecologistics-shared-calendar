import React, { useState } from "react";
import Layout from "../components/layout";
import Image from "next/image";

export default function AdminPage() {

  const profileImage = require('../images/profileImage.webp');

  const [accountRequests, setAccountRequests] = useState([
    { id: 1, name: "John Doe", email: "johndoe@example.com", status: "Pending", date: "10/02/2023", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    // ... other requests
  ]);

  const handleAction = (requestId: string, action: string) => {
    // Handle action logic (similar to before)
  };

  return (
    <Layout>
      <h1 style={{ textAlign: "center" }}>Admin View</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px" }}>Request For</th>
              <th style={{ padding: "10px" }}>Email</th>
              <th style={{ padding: "10px" }}>Status</th>
              <th style={{ padding: "10px" }}>Date & Time</th>
              <th style={{ padding: "10px"}}>Description</th>
            </tr>
          </thead>
          <tbody>
            {accountRequests.map((request) => (
              <tr key={request.id} style={{ border: "1px solid black" }}>
                {/* <td style={{ padding: "10px" }}>
                  <Image
                    src={request.image}
                    width={50}
                    height={50}
                    alt="profile-image"
                    placeholder="empty"
                    style={{ borderRadius: "50%" }}
                  />
                </td> */}
                <td style={{...styles.name, padding: "10px" }}>{request.name}</td>
                <td style={{...styles.email, padding: "10px" }}>{request.email}</td>
                <td style={{...styles.statusContainer, padding: "10px" }}><span style={{color: "#0d4f90", background: "#d4eaff", padding: "5px 10px", borderRadius: "20px"}}>{request.status}</span></td>
                <td style={{...styles.date, padding: "10px" }}>{new Date(request.date).toLocaleString()}</td>
                <td style = {{...styles.description,padding: "10px"}}>{request.description}</td>
                <td style={{...styles.buttonContainer, padding: "20px"}}>
                  <button
                    style={{...styles.buttons, padding: "5px 10px"}}
                    onClick={() => handleAction(request.id.toString(), "accepted")}
                    onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => ((e.target as HTMLButtonElement).style.backgroundColor = "#e69153")}
                    onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => ((e.target as HTMLButtonElement).style.backgroundColor = "#f7ab74")}
                  >
                    Approve
                  </button>
                  <button
                    style={{...styles.buttons, padding: "5px 10px", background: "#f7ab74"}}
                    onClick={() => handleAction(request.id.toString(), "declined")}
                    onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => ((e.target as HTMLButtonElement).style.backgroundColor = "#e69153")}
                    onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => ((e.target as HTMLButtonElement).style.backgroundColor = "#f7ab74")}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

const styles : { [key: string]: React.CSSProperties } = {
  mainContainer: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  // leftContainer: {
  //   textAlign: "center",
  //   width: "40vw",
  //   height: "60vh",
  //   borderRadius: "1%",
  //   background: "#D9D9D9",
  // },
  rightContainer: {
    // width: "70vw",
    // height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#D9D9D9",
    alignItems: "center",
    justifyContent: "flexStart",
    overflow: "scroll",
  },
  requestContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "white",
    height: "15%",
    width: "90%",
    margin: "1%",
  },
  profileImage: {
    margin: "5%",
    borderRadius: "50%",
  },
  statusContainer:{
  },
  buttons: {
    width: "100%",
    height: "100%",
    border: "0px",
    borderRadius: "9px",
    background: "#f7ab74",
    color: "black",
    cursor: "pointer",
    margin: "5%",
    fontWeight: "600"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    height: "50%",
    width: "50%",
  },
};
