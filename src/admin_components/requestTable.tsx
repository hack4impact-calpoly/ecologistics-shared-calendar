import React, { useState } from "react";
import Layout from "../components/layout";
import { Delete, DeleteOutline} from "@mui/icons-material";

const ITEMS_PER_PAGE = 11

export default function AdminPage() {
  
  const [currentPage, setCurrentPage] = useState(1)
  const profileImage = require('../images/profileImage.webp');

  const [accountRequests, setAccountRequests] = useState([
    { id: 1, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 2, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 3, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 4, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 5, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 6, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 7, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 8, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 9, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 10, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 11, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 12, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Pending", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    { id: 13, name: "AAPI SLO", email: "aapislo@gmail.com", status: "Approved", date: "10/02/2023", time: "1:00pm-2:30pm", description: "lorem ipsum nfeoigioehge...", image: profileImage },
    // ... other requests come after
  ]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, accountRequests.length);

  // Slice the accountRequests array to display only the items for the current page
  const currentRequests = accountRequests.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const calculateRange = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, accountRequests.length);
    return { startIndex, endIndex };
  };

  const handleAction = (requestId: string, action: string) => {
    // Handle action logic (similar to before)
  };

  //use effect: updates current page continuously 

  return (
    <div>
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
            <th style={{ padding: "10px"}}>Actions</th> {/* Add this column for buttons */}
          </tr>
        </thead>
        <tbody>
          {accountRequests
          .slice(calculateRange().startIndex, calculateRange().endIndex)
          .map((request) => (
            <tr key={request.id} style={{ border: "1px solid black" }}>
              <td style={{...styles.name, padding: "5px 50px" }}>{request.name}</td>
              <td style={{...styles.email, padding: "5px 50px" }}>{request.email}</td>
              <td style={{...styles.statusContainer, padding: "5px 50px" }}>
                <span style={{color: request.status === 'Pending' ? "#0d4f90" : "#105631", background: request.status === 'Pending' ? "#d4eaff" : "#E0F5EC", padding: "5px 10px", borderRadius: "20px", fontWeight: "700px"}}>
                  {request.status}
                </span>
              </td>
              <td style={{ padding: "5px 50px" }}>
                <span style={{ ...styles.date, fontSize: "16px", color: "black", fontWeight: "700", display: "block"}}>
                  {request.date}
                </span>
                <span  style={{ ...styles.time, fontSize: "14px", color: "black", display: "block"}}>
                  {request.time}
                </span>
              </td>
              <td style = {{...styles.description,padding: "5px 50px"}}>{request.description}</td>
              <td style={{...styles.buttonContainer, padding: "20px 50px"}}>
                {request.status === 'Pending' ? ( // Render buttons based on status
                  <>
                    <button
                      style={{...styles.buttons, padding: "8px 15px"}}
                      onClick={() => handleAction(request.id.toString(), "accepted")}
                      onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => ((e.target as HTMLButtonElement).style.backgroundColor = "#e69153")}
                      onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => ((e.target as HTMLButtonElement).style.backgroundColor = "#f7ab74")}
                    >
                      Approve
                    </button>
                    <button
                      style={{...styles.buttons, padding: "8px 25px", background: "#d9d9d9"}}
                      onClick={() => handleAction(request.id.toString(), "declined")}
                      onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => ((e.target as HTMLButtonElement).style.backgroundColor = "#C6C6C6")}
                      onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => ((e.target as HTMLButtonElement).style.backgroundColor = "#D9D9D9")}
                    >
                      Deny
                    </button>
                  </>
                ) : ( 
                  // Change Approve/Deny to trash can icon when status is "Accept"
                  <button
                    onClick={() => handleAction(request.id.toString(), "trash")}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#FECACC"; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#F6E0E1"; }}
                    style={{ padding: 0, background: "#f6e0e1", border: "none", cursor: "pointer", borderRadius: "100px", color: "#9C2C30"}}
                  >
                    <DeleteOutline style={{ fontSize: 38, backgroundColor: "transparent", borderRadius: "100px", padding: "10px" }} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        {Array.from({ length: Math.ceil(accountRequests.length / ITEMS_PER_PAGE) }, (_, index) => (
          <button
            key={index + 1}
            style={{
              margin: "5px",
              padding: "5px 10px",
              border: "0px",
              borderRadius: "5px",
              background: currentPage === index + 1 ? "#F0F8FF" : "white",
              color: currentPage === index + 1 ? "#0080FF" : "black",
              cursor: "pointer",
            }}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
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
  name:
  {
    textDecoration: "underline",
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
    fontWeight: "550"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    height: "50%",
    width: "50%",
  },
  icon:{
    backgroundColor: "transparent",
  },
  trashButton:{
    background: "#F6E0E1",
    color: "#9C2C30",
    border: "0px",
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center"
  }
};