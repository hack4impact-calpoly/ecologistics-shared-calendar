import React, { useState, useRef } from "react";
import { DeleteOutline } from "@mui/icons-material";

type AdminProps = {
  events: {
    id: number;
    name: string;
    email: string;
    status: string;
    date: string;
    time: string;
    description: string;
  }[];
  ITEMS_PER_PAGE: number;
};

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  handleAction: (requestID: string, action: string) => void;
  requestID: string;
}

const PopupContent: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  handleAction,
  requestID,
}) => {
  if (!isOpen) return null;
  return (
    <>
      <div style={styles.transparentBackground} />
      <div style={styles.popupContainer}>
        <h2 style={{ textAlign: "center" }}>
          Are you sure you want to delete this event?
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              ...styles.buttons,
              width: "122px",
              height: "37.6px",
              padding: "7.526px 10.752p",
              fontSize: "17px",
              margin: "0 4px 0 0",
            }}
            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "#e69153")
            }
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "#f7ab74")
            }
            onClick={onClose}
          >
            No
          </button>
          <button
            style={{
              ...styles.buttons,
              width: "324px",
              height: "37.6px",
              padding: "10px 39px",
              fontSize: "17px",
              margin: "0 0 0 4px",
            }}
            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "#e69153")
            }
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "#f7ab74")
            }
            onClick={() => {
              handleAction(requestID, "trash");
              onClose();
            }}
          >
            Yes, I want to delete this event
          </button>
        </div>
      </div>
    </>
  );
};

export default function AdminPage({ events, ITEMS_PER_PAGE }: AdminProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const profileImage = require("../images/profileImage.webp");

  // popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const [accountRequests, setAccountRequests] = useState(events);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    accountRequests.length
  );

  // Slice the accountRequests array to display only the items for the current page
  const currentRequests = accountRequests.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const calculateRange = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(
      startIndex + ITEMS_PER_PAGE,
      accountRequests.length
    );
    return { startIndex, endIndex };
  };

  const handleAction = (requestId: string, action: string) => {
    if (action === "trash") {
      // Filter out the request with the given id
      const updatedRequests = accountRequests.filter(
        (request) => request.id.toString() !== requestId
      );
      // Update the state with the filtered requests array
      setAccountRequests(updatedRequests);
    } else {
      // For accept/decline actions, update the status accordingly
      /*const updatedRequests = accountRequests.map((request) => {
        if (request.id.toString() === requestId) {
          return {
            ...request,
            status: action === "accepted" ? "Accepted" : "Declined",

          };
        }
        return request;
         });
        */

      // I would assume that when an event is approved or denied, it is updated on the
      // the backend, and is then rerendered on the new list
      const updatedRequests = accountRequests.filter(
        (request) => request.id.toString() !== requestId
      );

      // Update the state with the new account requests array
      setAccountRequests(updatedRequests);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "left" }}>
        <table
          style={{
            border: "1px solid #f7f7f7",
            borderCollapse: "collapse",
            borderSpacing: 0,
            borderBottom: "2px solid #f7f7f7",
          }}
        >
          <thead>
            <tr style={{ border: "1px solid #f7f7f7" }}>
              <th
                style={{
                  padding: "10px",
                  background: "#f7f7f7",
                  border: "1px solid #f7f7f7",
                }}
              >
                Request For
              </th>
              <th
                style={{
                  padding: "10px",
                  background: "#f7f7f7",
                  fontWeight: 500,
                  border: "1px solid #f7f7f7",
                }}
              >
                Email
              </th>
              <th
                style={{
                  padding: "10px",
                  background: "#f7f7f7",
                  fontWeight: 500,
                  border: "1px solid #f7f7f7",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "10px",
                  background: "#f7f7f7",
                  fontWeight: 500,
                  border: "1px solid #f7f7f7",
                }}
              >
                Date & Time
              </th>
              <th
                style={{
                  padding: "10px",
                  background: "#f7f7f7",
                  fontWeight: 500,
                  border: "1px solid #f7f7f7",
                }}
              >
                Description
              </th>
              <th style={{ padding: "10px", background: "#f7f7f7" }}></th>{" "}
              {/* Add this column for buttons */}
            </tr>
          </thead>
          <tbody>
            {accountRequests
              .slice(calculateRange().startIndex, calculateRange().endIndex)
              .map((request) => (
                <tr key={request.id} style={{ border: "1px solid #f7f7f7" }}>
                  <td style={{ ...styles.name, padding: "5px 50px" }}>
                    {request.name}
                  </td>
                  <td style={{ ...styles.email, padding: "5px 50px" }}>
                    {request.email}
                  </td>
                  <td
                    style={{ ...styles.statusContainer, padding: "5px 50px" }}
                  >
                    <span
                      style={{
                        color:
                          request.status === "Approved"
                            ? "#007500"
                            : request.status === "Declined"
                            ? "#9C0006"
                            : "#0d4f90",
                        background:
                          request.status === "Approved"
                            ? "#DFF0D8"
                            : request.status === "Declined"
                            ? "#FADBD8"
                            : "#d4eaff",

                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontWeight: "700px",
                      }}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td style={{ padding: "5px 50px" }}>
                    <span
                      style={{
                        ...styles.date,
                        fontSize: "16px",
                        color: "black",
                        fontWeight: "700",
                        display: "block",
                      }}
                    >
                      {request.date}
                    </span>
                    <span
                      style={{
                        ...styles.time,
                        fontSize: "14px",
                        color: "black",
                        display: "block",
                      }}
                    >
                      {request.time}
                    </span>
                  </td>
                  <td style={{ ...styles.description, padding: "5px 50px" }}>
                    {request.description}
                  </td>
                  <td
                    style={{ ...styles.buttonContainer, padding: "20px 50px" }}
                  >
                    {request.status === "Pending" ? ( // Render buttons based on status
                      <>
                        <button
                          style={{ ...styles.buttons, padding: "8px 15px" }}
                          onClick={() =>
                            handleAction(request.id.toString(), "accepted")
                          }
                          onMouseOver={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) =>
                            ((
                              e.target as HTMLButtonElement
                            ).style.backgroundColor = "#e69153")
                          }
                          onMouseOut={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) =>
                            ((
                              e.target as HTMLButtonElement
                            ).style.backgroundColor = "#f7ab74")
                          }
                        >
                          Approve
                        </button>
                        <button
                          style={{
                            ...styles.buttons,
                            padding: "8px 25px",
                            background: "#d9d9d9",
                          }}
                          onClick={() =>
                            handleAction(request.id.toString(), "declined")
                          }
                          onMouseOver={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) =>
                            ((
                              e.target as HTMLButtonElement
                            ).style.backgroundColor = "#C6C6C6")
                          }
                          onMouseOut={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) =>
                            ((
                              e.target as HTMLButtonElement
                            ).style.backgroundColor = "#D9D9D9")
                          }
                        >
                          Deny
                        </button>
                      </>
                    ) : (
                      // Change Approve/Deny to trash can icon when status is "Accept"
                      <>
                        <button
                          onClick={openPopup}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#FECACC";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#F6E0E1";
                          }}
                          style={{
                            padding: 0,
                            background: "#f6e0e1",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "100px",
                            color: "#9C2C30",
                          }}
                        >
                          <DeleteOutline
                            style={{
                              fontSize: 38,
                              backgroundColor: "transparent",
                              borderRadius: "100px",
                              padding: "10px",
                            }}
                          />
                        </button>

                        <PopupContent
                          isOpen={isPopupOpen}
                          onClose={closePopup}
                          handleAction={handleAction}
                          requestID={request.id.toString()}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        {Array.from(
          { length: Math.ceil(accountRequests.length / ITEMS_PER_PAGE) },
          (_, index) => (
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
          )
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  mainContainer: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  transparentBackground: {
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    position: "fixed",
    opacity: "0.5",
    background: "black",
    zIndex: "999",
  },
  popupContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(255,255,255,1)",
    zIndex: "1000",
    width: "649px",
    height: "239px",
  },
  rightContainer: {
    display: "flex",
    flexDirection: "column",
    background: "#D9D9D9",
    alignItems: "center",
    justifyContent: "flexStart",
    overflow: "scroll",
  },
  name: {
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
  statusContainer: {},
  buttons: {
    width: "100%",
    height: "100%",
    border: "0px",
    borderRadius: "9px",
    background: "#f7ab74",
    color: "black",
    cursor: "pointer",
    margin: "5%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    height: "50%",
    width: "50%",
  },
  icon: {
    backgroundColor: "transparent",
  },
  trashButton: {
    background: "#F6E0E1",
    color: "#9C2C30",
    border: "0px",
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center",
  },
};
