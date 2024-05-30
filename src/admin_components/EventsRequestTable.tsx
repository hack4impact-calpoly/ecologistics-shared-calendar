import React, { useState, useRef, useEffect } from "react";
import { DeleteOutline } from "@mui/icons-material";
import { useRouter } from "next/router";

type AdminProps = {
  events: {
    organization: string;
    title: string;
    startDate: string;
    endDate: string;
    description?: string;
    isVirtual: boolean;
    location: string;
    status: string;
    deniedReason?: string;
    imageLink?: string;
    createdBy: string;
    _id: string;
  }[];
  ITEMS_PER_PAGE: number;
  approveEvent: (id: string) => void;
  declineEvent: (id: string, declineMessage: string) => void;
  deleteEvent: (id: string) => void;
};

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  handleAction: (requestID: string, action: string) => void;
  message?: string;
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
  requestID: string;
}

function parseCommentDate(date: Date) {
  /*
  Parses MongoDB/TS date object
  :param time: date object
  :return: string reprsenting date
  */
  // Convert to Los Angeles time
  const losAngelesDate = new Date(
    date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  );

  // Format the date as desired
  const formattedDate = losAngelesDate.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  return formattedDate;
}

function parseCommentTime(startDate: Date, endDate: Date) {
  /*
  Parses MongoDB/TS date object
  :param time: date object
  :return: string reprsenting date
  */
  // Convert to Los Angeles time
  const losAngelesStartDate = new Date(
    startDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  );
  const losAngelesEndDate = new Date(
    endDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  );

  // Format the date as desired
  const formattedStartDate = losAngelesStartDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Format the date as desired
  const formattedEndDate = losAngelesEndDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return formattedStartDate + " - " + formattedEndDate;
}

const DeletePopup: React.FC<PopupProps> = ({
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

const DenyPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  handleAction,
  message = "",
  setMessage = () => {},
  requestID,
}) => {
  if (!isOpen) return null;
  return (
    <>
      <div style={styles.transparentBackground} />
      <div style={{ ...styles.popupContainer, height: "400px" }}>
        <h2 style={{ textAlign: "center", margin: "0" }}>
          Are you sure you want to deny this event?
        </h2>
        <form style={{ textAlign: "center" }}>
          <label style={{ textAlign: "center" }}>
            <textarea
              name="postContent"
              rows={8}
              cols={63}
              style={{
                borderRadius: "12px",
                fontStyle: "italic",
                padding: "10px",
                margin: "10px",
              }}
              placeholder="State reason for denying event (optional)"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </label>
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
              Cancel
            </button>
            <button
              style={{
                ...styles.buttons,
                width: "122px",
                height: "37.6px",
                //padding: "10px 39px",
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
                handleAction(requestID, "deny");
                onClose();
              }}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default function AdminPage({
  events,
  ITEMS_PER_PAGE,
  approveEvent,
  declineEvent,
  deleteEvent,
}: AdminProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const profileImage = require("../images/profileImage.webp");
  const router = useRouter();

  // Delete popup
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const openDeletePopup = () => setIsDeletePopupOpen(true);
  const closeDeletePopup = () => setIsDeletePopupOpen(false);

  // Deny popup
  const [isDenyPopupOpen, setIsDenyPopupOpen] = useState(false);
  const openDenyPopup = () => setIsDenyPopupOpen(true);
  const closeDenyPopup = () => setIsDenyPopupOpen(false);
  const [message, setMessage] = useState("");
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
      deleteEvent(requestId);
      // Filter out the request with the given _id
      const updatedRequests = accountRequests.filter(
        (request) => request._id.toString() !== requestId
      );
      if (
        requestId === accountRequests[accountRequests.length - 1]._id.toString()
      ) {
        setCurrentPage(currentPage - 1);
      }
      // Update the state with the filtered requests array
      setAccountRequests(updatedRequests);
    } else {
      // For accept/decline actions, update the status accordingly
      /*const updatedRequests = accountRequests.map((request) => {
        if (request._id.toString() === requestId) {
          return {
            ...request,
            status: action === "accepted" ? "Accepted" : "Declined",

          };
        }
        return request;
         });
        */
      if (action === "accepted") {
        approveEvent(requestId);
      } else if (action === "deny") {
        declineEvent(requestId, message);
      }

      // I would assume that when an event is approved or denied, it is updated on the
      // the backend, and is then rerendered on the new list
      const updatedRequests = accountRequests.filter(
        (request) => request._id.toString() !== requestId
      );

      // Update the state with the new account requests array
      setAccountRequests(updatedRequests);
    }
  };
  useEffect(() => {
    setAccountRequests(events);
  }, [events]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <table
          style={{
            border: "1px solid #f7f7f7",
            borderCollapse: "collapse",
            borderSpacing: 0,
            borderBottom: "2px solid #f7f7f7",
            width: "100%",
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
                Name
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
                <tr key={request._id} style={{ border: "1px solid #f7f7f7" }}>
                  <td
                    style={{ ...styles.name, padding: "5px 50px" }}
                    onClick={function (info) {
                      router.push({
                        pathname: "/eventDetails",
                        query: {
                          eventId: request._id,
                        },
                      });
                    }}
                  >
                    {request.title}
                  </td>
                  <td style={{ ...styles.email, padding: "5px 50px" }}>
                    {request.organization}
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
                      {parseCommentDate(new Date(request.startDate))}
                    </span>
                    <span
                      style={{
                        ...styles.time,
                        fontSize: "14px",
                        color: "black",
                        display: "block",
                      }}
                    >
                      {parseCommentTime(
                        new Date(request.startDate),
                        new Date(request.endDate)
                      )}
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
                          style={{
                            ...styles.buttons,

                            padding: "8px 15px",
                          }}
                          onClick={() =>
                            handleAction(request._id.toString(), "accepted")
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
                          onClick={openDenyPopup}
                          style={{
                            ...styles.buttons,

                            padding: "8px 25px",
                            background: "#d9d9d9",
                          }}
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
                        <DenyPopup
                          isOpen={isDenyPopupOpen}
                          onClose={closeDenyPopup}
                          handleAction={handleAction}
                          message={message}
                          setMessage={setMessage}
                          requestID={request._id.toString()}
                        />
                      </>
                    ) : (
                      // Change Approve/Deny to trash can icon when status is "Accept"
                      <>
                        <button
                          onClick={openDeletePopup}
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
                        <DeletePopup
                          isOpen={isDeletePopupOpen}
                          onClose={closeDeletePopup}
                          handleAction={handleAction}
                          requestID={request._id.toString()}
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
