import React, { useState, useEffect } from "react";
import { DeleteOutline } from "@mui/icons-material";
import { UserDocument } from "../database/userSchema";

type AdminProps = {
    events: UserDocument[];
    approveUser: (id: string) => void;
    declineUser: (id: string, declineMessage: string) => void;
    deleteUser: (id: string) => void;
    ITEMS_PER_PAGE: number;
};

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    handleAction: (requestID: string, action: string) => void;
    requestID: string;
}
interface DenyProps {
    isOpen: boolean;
    onClose: () => void;
    handleAction: (requestID: string, action: string) => void;
    requestID: string;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

function parseCommentTime(date: Date) {
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
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    return formattedDate;
}

function formatPhoneNumber(phoneNumberString: string) {
    if (phoneNumberString === null || phoneNumberString === undefined) {
        return ""; // Return an empty string if input is null or undefined
    }
    // Remove all non-digit characters from the phone number string
    const cleaned = phoneNumberString.replace(/\D/g, "");

    // Check if the cleaned phone number is empty
    if (cleaned.length === 0) {
        return "";
    }

    // Format the phone number based on its length
    let formattedNumber;
    if (cleaned.length === 10) {
        // Format for 10-digit phone numbers (e.g., 123-456-7890)
        formattedNumber = cleaned.replace(
            /(\d{3})(\d{3})(\d{4})/,
            "($1) $2-$3"
        );
    } else if (cleaned.length === 11 && cleaned.charAt(0) === "1") {
        // Format for 11-digit phone numbers with leading '1' (e.g., 1-123-456-7890)
        formattedNumber = cleaned.replace(
            /(\d{1})(\d{3})(\d{3})(\d{4})/,
            "$1-$2-$3-$4"
        );
    } else {
        // For any other length, return the cleaned phone number without formatting
        formattedNumber = cleaned;
    }

    return formattedNumber;
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
                    Are you sure you want to delete this account?
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
                            ((
                                e.target as HTMLButtonElement
                            ).style.backgroundColor = "#e69153")
                        }
                        onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
                            ((
                                e.target as HTMLButtonElement
                            ).style.backgroundColor = "#f7ab74")
                        }
                        onClick={onClose}
                    >
                        No
                    </button>
                    <button
                        style={{
                            ...styles.buttons,
                            width: "330px",
                            height: "37.6px",
                            padding: "10px 39px",
                            fontSize: "17px",
                            margin: "0 0 0 4px",
                        }}
                        onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
                            ((
                                e.target as HTMLButtonElement
                            ).style.backgroundColor = "#e69153")
                        }
                        onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
                            ((
                                e.target as HTMLButtonElement
                            ).style.backgroundColor = "#f7ab74")
                        }
                        onClick={() => {
                            handleAction(requestID, "trash");
                            onClose();
                        }}
                    >
                        Yes, I want to delete this account
                    </button>
                </div>
            </div>
        </>
    );
};

const DenyPopup: React.FC<DenyProps> = ({
    isOpen,
    onClose,
    handleAction,
    requestID,
    message,
    setMessage,
}) => {
    const [descriptionLen, setDescriptionLen] = useState(0);
    if (!isOpen) return null;
    return (
        <>
            <div style={styles.transparentBackground} />
            <div style={{ ...styles.popupContainer, height: "400px" }}>
                <h2 style={{ textAlign: "center", margin: "0" }}>
                    Are you sure you want to deny this account?
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
                            placeholder="State reason for denying account (optional)"
                            onChange={(e) => {
                                const currentLen = e.target.value.length;
                                if(currentLen <= 1500) {
                                    setDescriptionLen(currentLen);
                                    setMessage(e.target.value);
                                }
                                
                            }}
                        />
                    </label>
                    <p>Characters Typed: {descriptionLen}/1500</p>
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
                            onClick={() => {
                                console.log(message);
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
    approveUser,
    declineUser,
    deleteUser,
}: AdminProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const profileImage = require("../images/profileImage.webp");
    //const [users, setUsers] = useState([]);

    // Delete popup
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const openDeletePopup = () => setIsDeletePopupOpen(true);
    const closeDeletePopup = () => setIsDeletePopupOpen(false);

    // Deny popup
    const [isDenyPopupOpen, setIsDenyPopupOpen] = useState(false);
    const openDenyPopup = () => setIsDenyPopupOpen(true);
    const closeDenyPopup = () => setIsDenyPopupOpen(false);
    const [message, setMessage] = useState("");
    const [accountRequests, setAccountRequests] = useState<UserDocument[]>([]);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(
        startIndex + ITEMS_PER_PAGE,
        accountRequests.length
    );

    // Slice the accountRequests array to display only the items for the current page
    //const currentRequests = accountRequests.slice(startIndex, endIndex);

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
            deleteUser(requestId);
            // Filter out the request with the given id
            const updatedRequests = accountRequests.filter(
                (request) => request._id.toString() !== requestId
            );
            if (
                requestId ===
                accountRequests[accountRequests.length - 1]._id.toString()
            ) {
                setCurrentPage(currentPage - 1);
            }
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
            if (action === "accepted") {
                approveUser(requestId);
            } else if (action === "deny") {
                declineUser(requestId, message);
            }

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
                                    width: "15%",
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
                                    width: "12.5%",
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
                                    width: "12.5%",
                                }}
                            >
                                Position
                            </th>
                            <th
                                style={{
                                    padding: "10px",
                                    background: "#f7f7f7",
                                    fontWeight: 500,
                                    border: "1px solid #f7f7f7",
                                    width: "20%",
                                }}
                            >
                                Contact Information
                            </th>
                            <th
                                style={{
                                    padding: "10px",
                                    background: "#f7f7f7",
                                    fontWeight: 500,
                                    border: "1px solid #f7f7f7",
                                    width: "17.5%",
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
                                    width: "10%",
                                }}
                            >
                                Status
                            </th>
                            <th
                                style={{
                                    padding: "10px",
                                    background: "#f7f7f7",
                                    width: "12.5%",
                                }}
                            ></th>{" "}
                            {/* Add this column for buttons */}
                        </tr>
                    </thead>
                    <tbody>
                        {accountRequests
                            .slice(
                                calculateRange().startIndex,
                                calculateRange().endIndex
                            )
                            .map((request) => (
                                <tr
                                    key={request._id}
                                    style={{ border: "1px solid #f7f7f7" }}
                                >
                                    <td
                                        style={{
                                            ...styles.name,
                                            padding: "5px 50px",
                                        }}
                                    >
                                        {`${request.organization}` ||
                                            "No Org LListed"}
                                    </td>
                                    <td
                                        style={{
                                            ...styles.name,
                                            padding: "5px 50px",
                                        }}
                                    >
                                        {`${request.firstName} ${request.lastName}` ||
                                            "First Last"}
                                    </td>
                                    <td
                                        style={{
                                            ...styles.email,
                                            padding: "5px 50px",
                                        }}
                                    >
                                        {request.position}
                                    </td>
                                    <td
                                        style={{
                                            ...styles.email,
                                            padding: "5px 50px",
                                        }}
                                    >
                                        <p>
                                            {formatPhoneNumber(
                                                request.phoneNumber
                                            )}
                                        </p>
                                        <p>{request.email}</p>
                                    </td>

                                    <td
                                        style={{
                                            ...styles.email,
                                            padding: "5px 50px",
                                        }}
                                    >
                                        {parseCommentTime(request.createdAt)}
                                    </td>
                                    <td
                                        style={{
                                            ...styles.statusContainer,
                                            padding: "5px 50px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                color:
                                                    request.role === "approved"
                                                        ? "#007500"
                                                        : request.role ===
                                                          "declined"
                                                        ? "#9C0006"
                                                        : "#0d4f90",
                                                background:
                                                    request.role === "approved"
                                                        ? "#DFF0D8"
                                                        : request.role ===
                                                          "declined"
                                                        ? "#FADBD8"
                                                        : "#d4eaff",

                                                padding: "5px 10px",
                                                borderRadius: "20px",
                                                fontWeight: "700px",
                                            }}
                                        >
                                            {(request.role === "approved" &&
                                                "approved") ||
                                                (request.role === "declined" &&
                                                    "Declined") ||
                                                (request.role === "pending" &&
                                                    "Pending")}
                                        </span>
                                    </td>

                                    <td
                                        style={{
                                            ...styles.buttonContainer,
                                            padding: "20px 50px",
                                        }}
                                    >
                                        {request.role === "pending" ? ( // Render buttons based on status
                                            <>
                                                <button
                                                    style={{
                                                        ...styles.buttons,
                                                        padding: "8px 15px",
                                                    }}
                                                    onClick={() =>
                                                        handleAction(
                                                            request._id.toString(),
                                                            "accepted"
                                                        )
                                                    }
                                                    onMouseOver={(
                                                        e: React.MouseEvent<HTMLButtonElement>
                                                    ) =>
                                                        ((
                                                            e.target as HTMLButtonElement
                                                        ).style.backgroundColor =
                                                            "#e69153")
                                                    }
                                                    onMouseOut={(
                                                        e: React.MouseEvent<HTMLButtonElement>
                                                    ) =>
                                                        ((
                                                            e.target as HTMLButtonElement
                                                        ).style.backgroundColor =
                                                            "#f7ab74")
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
                                                        ).style.backgroundColor =
                                                            "#C6C6C6")
                                                    }
                                                    onMouseOut={(
                                                        e: React.MouseEvent<HTMLButtonElement>
                                                    ) =>
                                                        ((
                                                            e.target as HTMLButtonElement
                                                        ).style.backgroundColor =
                                                            "#D9D9D9")
                                                    }
                                                >
                                                    Deny
                                                </button>
                                                <DenyPopup
                                                    isOpen={isDenyPopupOpen}
                                                    onClose={closeDenyPopup}
                                                    handleAction={handleAction}
                                                    requestID={request._id.toString()}
                                                    message={message}
                                                    setMessage={setMessage}
                                                />
                                            </>
                                        ) : (
                                            // Change Approve/Deny to trash can icon when status is "Accept"
                                            <>
                                                <button
                                                    onClick={openDeletePopup}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.backgroundColor =
                                                            "#FECACC";
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.backgroundColor =
                                                            "#F6E0E1";
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
                                                            backgroundColor:
                                                                "transparent",
                                                            borderRadius:
                                                                "100px",
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
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                }}
            >
                {Array.from(
                    {
                        length: Math.ceil(
                            accountRequests.length / ITEMS_PER_PAGE
                        ),
                    },
                    (_, index) => (
                        <button
                            key={index + 1}
                            style={{
                                margin: "5px",
                                padding: "5px 10px",
                                border: "0px",
                                borderRadius: "5px",
                                background:
                                    currentPage === index + 1
                                        ? "#F0F8FF"
                                        : "white",
                                color:
                                    currentPage === index + 1
                                        ? "#0080FF"
                                        : "black",
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
