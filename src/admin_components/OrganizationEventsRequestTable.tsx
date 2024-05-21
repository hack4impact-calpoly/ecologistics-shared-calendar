import React, { useState, useEffect } from "react";
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
};

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  handleAction: (eventID: string, action: string) => void;
  eventID: string;
}

const DeletePopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  handleAction,
  eventID,
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
              handleAction(eventID, "trash");
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
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentEvents, setCurrentEvents] = useState(events);
  // Delete popup
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const openDeletePopup = () => setIsDeletePopupOpen(true);
  const closeDeletePopup = () => setIsDeletePopupOpen(false);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, events.length);

  useEffect(() => {
    // Update currentEvents whenever the events prop changes
    setCurrentEvents(events);
  }, [events]);

  // Slice the events array to display only the items for the current page
  const currentRequests = events.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const calculateRange = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, events.length);
    return { startIndex, endIndex };
  };

  const formatDate = (date: string) => {
    var newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

  const getTime = (startDate: string, endDate: string) => {
    var newStartDate = new Date(startDate);
    var newEndDate = new Date(endDate);
    return (
      newStartDate.toLocaleTimeString([], {
        timeStyle: "short",
      }) +
      " - " +
      newEndDate.toLocaleTimeString([], {
        timeStyle: "short",
      })
    );
  };

  const handleAction = async (eventID: string, action: string) => {
    if (action === "trash") {
      // Delete the event with the given _id
      if (
        eventID === events[events.length - 1]._id.toString() &&
        currentPage !== 1
      ) {
        setCurrentPage(currentPage - 1);
      }
      await fetch("/api/users/eventRoutes/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: eventID }),
      }).then((response) => response.json());
      setCurrentEvents((currentEvents) =>
        currentEvents.filter((event) => event._id !== eventID)
      );
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          boxSizing: "border-box",
          width: "90rem",
        }}
      >
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
                Event Name
              </th>
              <th
                style={{
                  padding: "10px",
                  background: "#f7f7f7",
                  fontWeight: 500,
                  border: "1px solid #f7f7f7",
                }}
              >
                Location
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
            {currentEvents
              .slice(calculateRange().startIndex, calculateRange().endIndex)
              .map((event) => (
                <>
                  <tr key={event._id} style={{ border: "1px solid #f7f7f7" }}>
                    <td 
                    style={{ ...styles.name, padding: "5px 50px" }}
                    onClick={function (info) {
                      router.push({
                        pathname: "/eventDetails",
                        query: {
                          eventId: event._id,
                        },
                      });
                    }}
                    >
                      {event.title}
                    </td>
                    <td style={{ ...styles.email, padding: "5px 50px" }}>
                      {event.location}
                    </td>
                    <td
                      style={{ ...styles.statusContainer, padding: "5px 50px" }}
                    >
                      <span
                        style={{
                          color:
                            event.status === "Approved"
                              ? "#007500"
                              : event.status === "Denied"
                              ? "#9C0006"
                              : "#0d4f90",
                          background:
                            event.status === "Approved"
                              ? "#DFF0D8"
                              : event.status === "Denied"
                              ? "#FADBD8"
                              : "#d4eaff",

                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontWeight: "700px",
                        }}
                      >
                        {event.status}
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
                        {formatDate(event.startDate.toString())}
                      </span>
                      <span
                        style={{
                          ...styles.time,
                          fontSize: "14px",
                          color: "black",
                          display: "block",
                        }}
                      >
                        {getTime(
                          event.startDate.toString(),
                          event.endDate.toString()
                        )}
                      </span>
                    </td>
                    <td style={{ ...styles.description, padding: "5px 50px" }}>
                      {event.description}
                    </td>
                    <td
                      style={{
                        ...styles.buttonContainer,
                        padding: "20px 50px",
                      }}
                    >
                      {event.status !== "Pending" ? ( // Render buttons based on status
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
                            eventID={event._id.toString()}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>

                  {event.deniedReason ? (
                    <tr>
                      <td
                        style={{ color: "#9C2C30", fontStyle: "italic" }}
                        align="left"
                        colSpan={5}
                      >
                        Reason for declining: {event.deniedReason}
                      </td>
                    </tr>
                  ) : (
                    <></>
                  )}
                </>
              ))}
          </tbody>
        </table>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        {Array.from(
          { length: Math.ceil(currentEvents.length / ITEMS_PER_PAGE) },
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
