import EventsTable from "../admin_components/EventsRequestTable";
import Layout from "../components/layout";
import React, { useState, useEffect} from "react";

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

// Interfaces for Event and API responses
interface Event {
  id: number;
  name: string;
  email: string;
  status: string;
  date: string;
  time: string;
  description: string;
}

interface ApiResponse {
  message: string;
  data: Event[];
}



export default function AdminRequestTable() {
  const [pending, setPending] = useState<Event[]>([]);
  const [approved, setApproved] = useState<Event[]>([]);
  const [postponed, setPostponed] = useState<Event[]>([]);
  const [declined, setDeclined] = useState<Event[]>([]);
  const [archived, setArchived] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/users/eventRoutes')
      .then(response => response.json())
      .then((response: ApiResponse) => {
        setPending(response.data.filter(event => event.status === "Pending"));
        setApproved(response.data.filter(event => event.status === 'Approved'));
        setPostponed(response.data.filter(event => event.status === 'Postponed'));
        setDeclined(response.data.filter(event => event.status === 'Declined'));
        setArchived(response.data.filter(event => event.status === 'Archived'));
      })
      .catch(error => console.error('Failed to fetch events:', error));
  }, []);
  console.log("pending", pending);

  return (
    <Layout>
      {/* Requested Events */}
      <div style={styles.container}>
        <div>
          <h1 style={{ alignSelf: "flex-start" }}>Inbox</h1>
          <div style={{ height: "0.35714rem", background: "#F07F2D" }}></div>
          <h3>Requested Events</h3>
          <EventsTable ITEMS_PER_PAGE={4} events={pending} />
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
          <EventsTable ITEMS_PER_PAGE={1} events={approved} />
        </div>

        {/* Postponed Events */}
        <div>
          <h3>Postponed Events</h3>
          <EventsTable ITEMS_PER_PAGE={1} events={postponed} />
        </div>
        {/* Declined Events */}
        <div>
          <h3>Declined Events</h3>
          <EventsTable ITEMS_PER_PAGE={1} events={declined} />
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
          <EventsTable ITEMS_PER_PAGE={3} events={archived} />
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
