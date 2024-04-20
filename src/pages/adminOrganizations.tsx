import AdminPage from "../admin_components/requestTable";
import Layout from "../components/layout";
import React, { useState } from "react";

const pending = [
  {
    id: 1,
    name: "AAPI SLO 1",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 2,
    name: "AAPI SLO 2",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 3,
    name: "AAPI SLO 3",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 4,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 5,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 6,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 7,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 8,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 9,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 10,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 11,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 12,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Pending",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  // ... other requests come after
];

const approved = [
  {
    id: 1,
    name: "AAPI SLO 1",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 2,
    name: "AAPI SLO 2",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 3,
    name: "AAPI SLO 3",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 4,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 5,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 6,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 7,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 8,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 9,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 10,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 11,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 12,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  // ... other requests come after
];

const postponed = [
  {
    id: 1,
    name: "AAPI SLO 1",
    email: "aapislo@gmail.com",
    status: "Postponed",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 2,
    name: "AAPI SLO 2",
    email: "aapislo@gmail.com",
    status: "Postponed",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 3,
    name: "AAPI SLO 3",
    email: "aapislo@gmail.com",
    status: "Postponed",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
];

const declined = [
  {
    id: 1,
    name: "AAPI SLO 1",
    email: "aapislo@gmail.com",
    status: "Declined",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 2,
    name: "AAPI SLO 2",
    email: "aapislo@gmail.com",
    status: "Declined",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 3,
    name: "AAPI SLO 3",
    email: "aapislo@gmail.com",
    status: "Declined",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
];

const archived = [
  {
    id: 1,
    name: "AAPI SLO 1",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 2,
    name: "AAPI SLO 2",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 3,
    name: "AAPI SLO 3",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 4,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 5,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 6,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 7,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 8,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 9,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 10,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 11,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  {
    id: 12,
    name: "AAPI SLO",
    email: "aapislo@gmail.com",
    status: "Approved",
    date: "10/02/2023",
    time: "1:00pm-2:30pm",
    description: "lorem ipsum nfeoigioehge...",
  },
  // ... other requests come after
];

export default function AdminRequestTable() {
  return (
    <Layout>
      {/* Requested Events */}
      <div style={styles.container}>
        <div>
          <h1 style={{ alignSelf: "flex-start" }}>Inbox</h1>
          <div style={{ height: "0.35714rem", background: "#F07F2D" }}></div>
          <h3>Requested Events</h3>
          <AdminPage ITEMS_PER_PAGE={4} events={pending} />
        </div>
        {/* Approved Events */}
        <div>
          <h1 style={{ alignSelf: "flex-start" }}>Active events</h1>
          <div
            style={{
              height: "0.35714rem",
              background: "#F07F2D",
            }}
          ></div>
          <h3>Approved Events</h3>
          <AdminPage ITEMS_PER_PAGE={1} events={approved} />
        </div>

        {/* Postponed Events */}
        <div>
          <h3>Postponed Events</h3>
          <AdminPage ITEMS_PER_PAGE={1} events={postponed} />
        </div>
        {/* Declined Events */}
        <div>
          <h3>Declined Events</h3>
          <AdminPage ITEMS_PER_PAGE={1} events={declined} />
        </div>
        {/* Past Events */}
        <div>
          <h1 style={{ textAlign: "left" }}>Past events</h1>
          <div
            style={{
              height: "0.35714rem",
              background: "#335543",
            }}
          ></div>
          <h3>Archived</h3>
          <AdminPage ITEMS_PER_PAGE={3} events={archived} />
        </div>
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};
