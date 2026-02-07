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

export default function PendingApprovals() {
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [pendingOrganizations, setPendingOrganizations] = useState<UserDocument[]>([]);

  return (
    <div style={styles.container}>
      <h1>Pending Approvals</h1>

      {/* Pending Events Section */}
      <div style={styles.section}>
        <h2>Pending Events</h2>
        <p>No pending events</p>
      </div>

      {/* Pending Organizations Section */}
      <div style={styles.section}>
        <h2>Pending Organizations</h2>
        <p>No pending organizations</p>
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
};
