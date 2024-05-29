import EventsTable from "../admin_components/EventsRequestTable";
import Layout from "../components/layout";
import React, { useState, useEffect} from "react";
import axios from "axios";
import { EventDocument } from "../database/eventSchema";

// Interfaces for Event and API responses
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

export default function AdminRequestTable() {
  const [events, setEvents] = useState<EventDocument[]>([]);
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
        setApproved(response.data.filter(event => (event.status === 'Approved' && new Date(event.endDate) > new Date())));
        setPostponed(response.data.filter(event => event.status === 'Postponed'));
        setDeclined(response.data.filter(event => event.status === 'Denied'));
        setArchived(response.data.filter(event => (event.status === 'Approved' && new Date(event.endDate) < new Date())));
      })
      .catch(error => console.error('Failed to fetch events:', error));
  });

  const approveEvent = async (id: string) => {
    /*
    Approves user in clerk/mongodb and updates state
    :param id: user mongo id
    */
    try {
        //axios patch to update status
        await axios.patch(`/api/admins/eventRoutes`, {
            id: id,
            status: "Approved",
            declineMessage: "",
        });
        console.log("id", id);
        // Update the status in the user state variable
        const updatedEvents = events.map((event) => {
            if (event._id.toHexString() === id) {
                return { ...event, deniedReason:"",status: "Approved" };
            }
            return event;
        });
        setEvents(updatedEvents);
    } catch (err) {
        console.error(err);
    }
};

const declineEvent = async (id: string, message: string) => {
    /*
    Approves user in clerk/mongodb and updates state
    :param id: user mongo id
    */
   console.log("The message :", message);
    try {
        //axios patch to update status
        await axios.patch(`/api/admins/eventRoutes`, {
            id: id,
            status: "Denied",
            deniedReason: message,
        });
        // Update the status in the user state variable
        const updatedEvents = events.map((event) => {
            if (event._id.toHexString() === id) {
                return { ...event, deniedReason: message ,status: "Denied" };
            }
            return event;
        });
        setEvents(updatedEvents);
    } catch (err) {
        console.error(err);
    }
};

const deleteEvent = async (id: string) => {
  /*
  Deletes user rom mongo and clerk if trash button clicked
  :param id: user to delete's mongo _id
  */
  try {
    await axios.delete(`/api/admins/eventRoutes`, { data: { id } });
  } catch (err) {
    console.error(err);
  }
};


  return (
    <Layout>
      {/* Requested Events */}
      <div style={styles.container}>
        <div style={{ width: "90%" }}>
          <h1 style={{ alignSelf: "flex-start" }}>Inbox</h1>
          <div style={{ height: "0.35714rem", background: "#F07F2D" }}></div>
          <h3>Requested Events</h3>
          {pending.length == 0 ? <p style={{textAlign: "center"}}>No Event Requests Yet</p> :
          <EventsTable 
              approveEvent={approveEvent}
              declineEvent={declineEvent}
              deleteEvent={deleteEvent}
              ITEMS_PER_PAGE={4} 
              events={pending} 
          />}
        </div>
        {/* Approved Events */}
        <div style={{ width: "90%" }}> 
          <h1 style={{ alignSelf: "flex-start" }}>Active events</h1>
          <div
            style={{
              height: "0.35714rem",
              background: "#F07F2D",
            }}
          ></div>
          <h3>Approved Events</h3>
          {approved.length == 0 ? <p style={{textAlign: "center"}}>No Events Yet</p> :
          <EventsTable 
              approveEvent={approveEvent}
              declineEvent={declineEvent}
              deleteEvent={deleteEvent}
              ITEMS_PER_PAGE={4} 
              events={approved} 
          />}
        </div>

        {/* Postponed Events
        <div>
          <h3>Postponed Events</h3>
          <EventsTable 
              approveEvent={approveEvent}
              declineEvent={declineEvent}
              deleteEvent={deleteEvent}
              ITEMS_PER_PAGE={4} 
              events={postponed} 
          />
        </div> */}
        {/* Declined Events */}
        <div style={{ width: "90%" }}>
          <h3>Declined Events</h3>
          {declined.length == 0 ? <p style={{textAlign: "center"}}>No Events Yet</p> :
          <EventsTable 
              approveEvent={approveEvent}
              declineEvent={declineEvent}
              deleteEvent={deleteEvent}
              ITEMS_PER_PAGE={4} 
              events={declined} 
          />}
          
        </div>
        {/* Past Events */}
        <div style={{ width: "90%" }}>
          <h1 style={{ textAlign: "left" }}>Past events</h1>
          <div
            style={{
              height: "0.35714rem",
              background: "#335543",
            }}
          ></div>
          <h3>Archived</h3>
          {archived.length == 0 ? <p style={{textAlign: "center"}}>No Past Events Yet</p> :
          <EventsTable 
              approveEvent={approveEvent}
              declineEvent={declineEvent}
              deleteEvent={deleteEvent}
              ITEMS_PER_PAGE={4} 
              events={archived} 
          />}
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
