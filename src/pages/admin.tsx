import AdminPage from "../admin_components/requestTable"
import Layout from "../components/layout";
import React, { useState } from "react";



export default function AdminRequestTable() {

    const profileImage = require('../images/profileImage.webp');
  
    const [accountRequests, setAccountRequests] = useState([
      { id: 1, name: "John Doe", image: profileImage },
      { id: 2, name: "Jane Smith", image: profileImage },
      { id: 3, name: "A Smith", image: profileImage },
      { id: 4, name: "B Smith", image: profileImage },
      { id: 5, name: "C Smith", image: profileImage },
      { id: 6, name: "D Smith", image: profileImage },
      { id: 7, name: "E Smith", image: profileImage },
    ]);
    const handleAction = (requestId: string, action: string) => {
      // Just log whether the account is accepted or declined for now
      console.log(`Account request ${requestId} ${action}`);
  
      // Update the state to remove the handled request
      setAccountRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== Number(requestId))
      );
    };
    return (
      <Layout>
        {/* <h1 style={{ textAlign: "center" }}> Admin View</h1> */}
        <AdminPage/>
        {/* <div style={styles.mainContainer}>
          <div style={styles.leftContainer}>
            Welcome to admin view. Accept or decline account requests.
          </div>
          <div style={styles.rightContainer}>
            Requests
            {accountRequests.map((request) => (
              <div key={request.id} style={styles.requestContainer}>
                <img 
                    src={request.image}
                    width={50}
                    height={50}
                    alt="profile-image"
                    placeholder="empty"
                    style={styles.profileImage}
                />
                <div>{request.name}</div>
                <div style={styles.buttonContainer}>
                  <button
                    style={styles.button}
                    onClick={() => handleAction(request.id.toString(), "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    style={styles.button}
                    onClick={() => handleAction(request.id.toString(), "declined")}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </Layout>
    );
  }
  
  const styles : { [key: string]: React.CSSProperties } = {
    mainContainer: {
      display: "flex",
      justifyContent: "space-evenly",
    },
    leftContainer: {
      textAlign: "center",
      width: "40vw",
      height: "60vh",
      borderRadius: "1%",
      background: "#D9D9D9",
    },
    rightContainer: {
      width: "40vw",
      height: "60vh",
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
    button: {
      width: "45%",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-evenly",
      height: "50%",
      width: "50%",
    },
  };