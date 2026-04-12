import React, { useState, useEffect } from "react";
import { UserDocument } from "../database/userSchema";
import axios from "axios";

interface Event {
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
}

interface ApiResponse {
  message: string;
  data: Event[];
}

interface PendingApprovalsProps {
  initialEvents?: Event[];
  initialOrgs?: UserDocument[];
}

// Popup that asks for an optional reason when denying
interface DenyPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
}

function DenyPopup({ isOpen, onClose, onConfirm }: DenyPopupProps) {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  return (
    <>
      <div style={styles.overlay} />
      <div style={styles.popup}>
        <h3 style={{ textAlign: "center" }}>Are you sure you want to deny this?</h3>
        <textarea
          rows={6}
          style={styles.textarea}
          placeholder="State reason for denying (optional)"
          onChange={(e) => setMessage(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button style={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            style={styles.confirmButton}
            onClick={() => {
              onConfirm(message);
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  );
}

export default function PendingApprovals({ initialEvents, initialOrgs }: PendingApprovalsProps = {}) {
  const [pendingEvents, setPendingEvents] = useState<Event[]>(initialEvents ?? []);
  const [pendingOrganizations, setPendingOrganizations] = useState<UserDocument[]>(initialOrgs ?? []);
  const [loadingEvents, setLoadingEvents] = useState(!initialEvents);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);
  const [loadingOrganizations, setLoadingOrganizations] = useState(!initialOrgs);
  const [errorOrganizations, setErrorOrganizations] = useState<string | null>(
    null,
  );

  // Track which item's deny popup is open (stores the item's _id)
  const [denyEventPopupOpen, setDenyEventPopupOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [denyOrgPopupOpen, setDenyOrgPopupOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  useEffect(() => {
    if (initialEvents) return;
    const fetchPendingEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await fetch("/api/users/eventRoutes");

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data: ApiResponse = await response.json();
        const allEvents = data.data;

        // Filter for "Pending" status only
        const eventsWithPendingStatus = allEvents.filter((event) => {
          return event.status === "Pending";
        });

        setPendingEvents(eventsWithPendingStatus);
      } catch (error) {
        console.error("Error fetching pending events:", error);
        setErrorEvents("Failed to fetch events");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchPendingEvents();
  }, []); // Runs once on mount

  useEffect(() => {
    if (initialOrgs) return;
    const fetchPendingOrganizations = async () => {
      try {
        setLoadingOrganizations(true);
        const response = await fetch("/api/admins/userRoutes");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const body = await response.json();
        const allUsers = body && body.data ? body.data : [];

        // Filter for "pending" role only
        const usersWithPendingRole = allUsers.filter((user: UserDocument) => {
          return user.role === "pending";
        });

        setPendingOrganizations(usersWithPendingRole);
      } catch (error) {
        console.error("Error fetching pending organizations:", error);
        setErrorOrganizations("Failed to fetch organizations");
      } finally {
        setLoadingOrganizations(false);
      }
    };

    fetchPendingOrganizations();
  }, []); // Runs once on mount

  const approveEvent = async (id: string) => {
    try {
      const response = await axios.patch("/api/admins/eventRoutes", {
        id: id,
        status: "Approved",
        declineMessage: "",
      });

      const updatedEvents = pendingEvents.filter((event) => {
        return event._id !== id;
      });
      setPendingEvents(updatedEvents);

      const approvedEvent = response.data.data;

      // Look up the user who created this event to send them an email
      const userResponse = await fetch(
        "/api/userRoutes/?createdBy=" + approvedEvent.createdBy,
      );
      const userData = await userResponse.json();

      await fetch("/api/sendGrid/orgRoutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress: userData?.data?.email,
          firstName: userData?.data?.firstName,
          orgName: userData?.data?.organization,
          eventTitle: approvedEvent.title,
          templateId: "d-d91e07d6440a460eaae6e9d4203a6936",
        }),
      });
    } catch (error) {
      console.error("Error approving event:", error);
    }
  };

  const declineEvent = async (id: string, message: string) => {
    try {
      const response = await axios.patch("/api/admins/eventRoutes", {
        id: id,
        status: "Denied",
        deniedReason: message,
      });

      const updatedEvents = pendingEvents.filter((event) => {
        return event._id !== id;
      });
      setPendingEvents(updatedEvents);

      const declinedEvent = response.data.data;

      // Look up the user who created this event to send them an email
      const userResponse = await fetch(
        "/api/userRoutes/?createdBy=" + declinedEvent.createdBy,
      );
      const userData = await userResponse.json();

      await fetch("/api/sendGrid/orgRoutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress: userData?.data?.email,
          firstName: userData?.data?.firstName,
          orgName: userData?.data?.organization,
          eventTitle: declinedEvent.title,
          deniedReason: message,
          templateId: "d-16d0c9212a1c46ce9d7dd50b623f4e39",
        }),
      });
    } catch (error) {
      console.error("Error declining event:", error);
    }
  };

  const approveOrg = async (id: string) => {
    try {
      await axios.patch(`/api/admins/users/${id}`, {
        role: "approved",
      });

      // Find the user before filtering them out so we still have their data for the email
      const userToApprove = pendingOrganizations.find((user) => {
        return user._id === id;
      });

      const updatedOrgs = pendingOrganizations.filter((user) => {
        return user._id !== id;
      });
      setPendingOrganizations(updatedOrgs);

      if (userToApprove) {
        await fetch("/api/sendGrid/orgRoutes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailAddress: userToApprove.email,
            firstName: userToApprove.firstName,
            orgName: userToApprove.organization,
            templateId: "d-ff6ffd8130ce46c99acd82aa60452890",
          }),
        });
      }
    } catch (error) {
      console.error("Error approving org:", error);
    }
  };

  const declineOrg = async (id: string, message: string) => {
    try {
      await axios.patch(`/api/admins/users/${id}`, {
        role: "declined",
        declineMessage: message,
      });

      // Find the user before filtering them out so we still have their data for the email
      const userToDecline = pendingOrganizations.find((user) => {
        return user._id === id;
      });

      const updatedOrgs = pendingOrganizations.filter((user) => {
        return user._id !== id;
      });
      setPendingOrganizations(updatedOrgs);

      if (userToDecline) {
        await fetch("/api/sendGrid/orgRoutes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailAddress: userToDecline.email,
            firstName: userToDecline.firstName,
            orgName: userToDecline.organization,
            deniedReason: message,
            templateId: "d-d4b7037961ac48d9b1a02bef52494c1d",
          }),
        });
      }
    } catch (error) {
      console.error("Error declining org:", error);
    }
  };

  function renderEventsSection() {
    if (loadingEvents) {
      return <p>Loading pending events...</p>;
    }

    if (errorEvents) {
      return <p style={styles.error}>Error: {errorEvents}</p>;
    }

    if (pendingEvents.length === 0) {
      return <p>No pending events</p>;
    }

    return (
      <ul style={styles.list}>
        {pendingEvents.map((event) => (
          <li key={event._id} style={styles.listItem}>
            <div>
              <strong>{event.title}</strong>
              <p>Organization: {event.organization}</p>
              <p>
                Start Date: {new Date(event.startDate).toLocaleDateString()}
              </p>
              <p>Location: {event.isVirtual ? "Virtual" : event.location}</p>
              {event.description && <p>Description: {event.description}</p>}
            </div>
            <div style={styles.buttonRow}>
              <button
                style={styles.approveButton}
                onClick={() => approveEvent(event._id)}
              >
                Approve
              </button>
              <button
                style={styles.denyButton}
                onClick={() => {
                  setSelectedEventId(event._id);
                  setDenyEventPopupOpen(true);
                }}
              >
                Deny
              </button>
            </div>
          </li>
        ))}
        <DenyPopup
          isOpen={denyEventPopupOpen}
          onClose={() => setDenyEventPopupOpen(false)}
          onConfirm={(message) => {
            if (selectedEventId) {
              declineEvent(selectedEventId, message);
            }
          }}
        />
      </ul>
    );
  }

  function renderOrganizationsSection() {
    if (loadingOrganizations) {
      return <p>Loading pending organizations...</p>;
    }

    if (errorOrganizations) {
      return <p style={styles.error}>Error: {errorOrganizations}</p>;
    }

    if (pendingOrganizations.length === 0) {
      return <p>No pending organizations</p>;
    }

    return (
      <ul style={styles.list}>
        {pendingOrganizations.map((user) => (
          <li key={user._id} style={styles.listItem}>
            <div>
              <strong>{user.organization}</strong>
              <p>
                Contact: {user.firstName} {user.lastName}
              </p>
              <p>Email: {user.email}</p>
              <p>Position: {user.position}</p>
              {user.phoneNumber && <p>Phone: {user.phoneNumber}</p>}
            </div>
            <div style={styles.buttonRow}>
              <button
                style={styles.approveButton}
                onClick={() => approveOrg(user._id)}
              >
                Approve
              </button>
              <button
                style={styles.denyButton}
                onClick={() => {
                  setSelectedOrgId(user._id);
                  setDenyOrgPopupOpen(true);
                }}
              >
                Deny
              </button>
            </div>
          </li>
        ))}
        <DenyPopup
          isOpen={denyOrgPopupOpen}
          onClose={() => setDenyOrgPopupOpen(false)}
          onConfirm={(message) => {
            if (selectedOrgId) {
              declineOrg(selectedOrgId, message);
            }
          }}
        />
      </ul>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Pending Approvals</h1>

      <div style={styles.section}>
        <h2>Pending Events</h2>
        {renderEventsSection()}
      </div>

      <div style={styles.section}>
        <h2>Pending Organizations</h2>
        {renderOrganizationsSection()}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
  },
  section: {
    marginBottom: "30px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
  },
  approveButton: {
    padding: "8px 15px",
    border: "0px",
    borderRadius: "9px",
    background: "#f7ab74",
    cursor: "pointer",
  },
  denyButton: {
    padding: "8px 15px",
    border: "0px",
    borderRadius: "9px",
    background: "#d9d9d9",
    cursor: "pointer",
  },
  overlay: {
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    position: "fixed",
    opacity: "0.5",
    background: "black",
    zIndex: 999,
  },
  popup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    zIndex: 1000,
    width: "500px",
    padding: "30px",
    borderRadius: "10px",
  },
  textarea: {
    borderRadius: "12px",
    fontStyle: "italic",
    padding: "10px",
    width: "100%",
    boxSizing: "border-box",
  },
  cancelButton: {
    padding: "8px 20px",
    border: "0px",
    borderRadius: "9px",
    background: "#f7ab74",
    cursor: "pointer",
  },
  confirmButton: {
    padding: "8px 20px",
    border: "0px",
    borderRadius: "9px",
    background: "#d9d9d9",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};
