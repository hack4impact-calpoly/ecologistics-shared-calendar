import React, { useState, useEffect } from "react";
import { UserDocument } from "../database/userSchema";

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

export default function PendingApprovals() {
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [pendingOrganizations, setPendingOrganizations] = useState<
    UserDocument[]
  >([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [errorOrganizations, setErrorOrganizations] = useState<string | null>(
    null,
  );

  // Fetch all events and filter for pending ones
  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await fetch("/api/users/eventRoutes");

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data: ApiResponse = await response.json();
        const allEvents = data.data;

        // Filter to only get events with "Pending" status
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
  }, []);

  // Fetch all users and filter for pending ones
  useEffect(() => {
    const fetchPendingOrganizations = async () => {
      try {
        setLoadingOrganizations(true);
        const response = await fetch("/api/admins/userRoutes");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const body = await response.json();
        const allUsers = body && body.data ? body.data : [];

        // Filter to only get users with "pending" role
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
  }, []);

  // Helper function to render the events section
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
          </li>
        ))}
      </ul>
    );
  }

  // Helper function to render the organizations section
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
          </li>
        ))}
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
  },
  error: {
    color: "red",
  },
};
