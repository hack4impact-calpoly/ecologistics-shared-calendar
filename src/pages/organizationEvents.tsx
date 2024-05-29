import EventsTable from "../admin_components/OrganizationEventsRequestTable";
import Layout from "../components/layout";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";


type eventType = {
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
};

export default function OrganizationEvents() {
  const [uid, setUID] = useState("");

  const { user } = useUser();

  const [approvedEvents, setApprovedEvents] = useState<eventType[]>([]);
  const [deniedEvents, setDeniedEvents] = useState<eventType[]>([]);
  const [pastEvents, setPastEvents] = useState<eventType[]>([]);
  const [pendingEvents, setPendingEvents] = useState<eventType[]>([]);

  // method to filter events seperate approved, denied, pending, and past
  const filterStatusAndPastEndDate = (list: eventType[], status: string) => {
    const currentDate = new Date();
    return list.filter((event: eventType) => {
      var eventDate = new Date(event.endDate);
      return event.status === status && eventDate > currentDate;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid_response = await fetch("/api/userRoutes/?clerkId=" + uid);
        if (!uid_response.ok) {
          throw new Error("Network response was not ok");
        }
        const user = await uid_response.json();

        const _id_response = await fetch(
          "/api/users/eventRoutes/?createdBy=" + user.data._id
        );

        if (!_id_response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseData = await _id_response.json();

        const approved = filterStatusAndPastEndDate(
          responseData.data,
          "Approved"
        );
        //console.log(approved);
        const denied = filterStatusAndPastEndDate(responseData.data, "Denied");
        const pending = filterStatusAndPastEndDate(
          responseData.data,
          "Pending"
        );

        setApprovedEvents(approved);
        setDeniedEvents(denied);
        setPendingEvents(pending);
        setPastEvents(
          responseData.data.filter(
            (event: eventType) =>
              !approved.includes(event) &&
              !denied.includes(event) &&
              !pending.includes(event)
          )
        );
      } catch (error) {}
    };

    if (user) {
      setUID(user.id);
      fetchData();
    }
  }, [user, uid]);
  return (
    <Layout>
      {/* Requested Events */}
      <div style={styles.container}>
        <div style={{ width: "90%"}}>
          <h1 style={{ alignSelf: "flex-start" }}>Outgoing Event Requests</h1>
          <div style={{ height: "0.35714rem", background: "#F07F2D" }}></div>
          <h3>Requested Events</h3>
          {pendingEvents.length == 0 ? <p style={{textAlign: "center"}}>No Events Yet</p> : 
          <EventsTable 
            ITEMS_PER_PAGE={4}
            events={pendingEvents} 
          />}
        </div>

        {/* Approved Events */}
        <div style={{ width: "90%"}}>
          <h2 style={{ alignSelf: "flex-start" }}>Active events</h2>
          <div
            style={{
              height: "0.35714rem",
              background: "#F07F2D",
            }}
          ></div>
          <h3>Approved Events</h3>
          {approvedEvents.length == 0 ? <p style={{textAlign: "center"}}>No Events Yet</p> : 
          <EventsTable 
            ITEMS_PER_PAGE={3}
            events={approvedEvents} 
          />}
        </div>

        {/* Declined Events */}
        <div style={{ width: "90%"}}>
          <h3>Declined Events</h3>
          {deniedEvents.length == 0 ? <p style={{textAlign: "center"}}>No Events Yet</p> : 
          <EventsTable 
            ITEMS_PER_PAGE={3}
            events={deniedEvents} 
          />}
        </div>

        {/* Past Events */}
        <div style={{ width: "90%"}}>
          <h2 style={{ textAlign: "left" }}>Past events</h2>
          <div
            style={{
              height: "0.35714rem",
              background: "#335543",
            }}
          ></div>
          <h3>Archived</h3>
          {pastEvents.length == 0 ? <p style={{textAlign: "center"}}>No Events Yet</p> : 
          <EventsTable 
            ITEMS_PER_PAGE={3}
            events={pastEvents} 
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
