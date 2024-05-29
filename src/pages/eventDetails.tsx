import React, { use, useEffect } from "react";
import Layout from "../components/layout";
import StaticMap from "../components/map";
import { EventDocument } from "../database/eventSchema";
import { useRouter } from "next/router";
import { convertEventDatesToDates, getFormattedDate } from "../utils/events";
import { red } from "@mui/material/colors";

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

function parseAddress(address: string): Address {
  const [street, city, state, postalCode] = address.split(", ");

  return {
    street,
    city,
    state,
    postalCode,
  };
}

export default function EventPage() {
  const [event, setEvent] = React.useState<EventDocument | null>(null);
  const [address, setAddress] = React.useState<Address | null>(null);

  const router = useRouter();
  const eventId = router.query.eventId;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/users/eventRoutes?id=${eventId}`);
        const data = await response.json();

        convertEventDatesToDates(data.data);
        const event: EventDocument = data.data[0];
        event.startDate = new Date(event.startDate);
        event.endDate = new Date(event.endDate);

        setEvent(event);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (event && !event.isVirtual) {
      setAddress(parseAddress(event.location));
    }
  }, [event]);

  console.log("EVENT: ", event);

  return (
    <Layout>
      {event && (
        <div style={styles.container}>
          <div style={styles.box}>
            {event.status === "Pending" && (
              <h1 style={{ color: "green" }}>PREVIEW OF EVENT</h1>
            )}
            {event.status === "Denied" && (
              <h1 style={{ color: "red" }}>DENIED</h1>
            )}

            <h1 style={styles.title}>{event.title}</h1>
            <p style={styles.date}>
              {`Starts on ${getFormattedDate(event.startDate)}`}
            </p>
            <p style={styles.date}>
              {`Ends on ${getFormattedDate(event.endDate)}`}
            </p>
            <div style={styles.imagePlaceholder}>
              <img
                src={
                  event.imageLink || "https://calendar-image-storage.s3.amazonaws.com/Screenshot+2024-05-27+at+3.27.32%E2%80%AFPM.png"
                }
                alt="Event Image"
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={styles.descriptionBox}>
              <p style={styles.descriptionText}>{event.description}</p>
            </div>
            <div style={styles.locationAndMapContainer}>
              <div style={styles.locationTypeContainer}>
                <h2 style={styles.locationType}>
                  {event.isVirtual ? "Link" : "Address"}
                </h2>
                <address style={styles.address}>
                  {event.isVirtual ? (
                    <a
                      href={event.location}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.location}
                    </a>
                  ) : (
                    event.location
                  )}
                </address>
              </div>
              {address && !event.isVirtual && (
                <div style={styles.mapPlaceholder}>
                  <StaticMap
                    street={address.street}
                    state={address.state}
                    city={address.city}
                    postalCode={address.postalCode}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  box: {
    backgroundColor: "white",
    padding: "50px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "600px",
    textAlign: "left",
  },
  centeredBox: {
    backgroundColor: "white",
    padding: "50px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: "100vh", // Make the box take the full height of the viewport
  },
  title: {
    fontFamily: "DM Sans",
    fontSize: "24px",
    margin: "0 0 8px 0",
    fontWeight: "bold",
    color: "#F07F2D",
  },
  date: {
    fontFamily: "DM Sans",
    fontSize: "16px",
    margin: "0 0 16px 0",
    fontWeight: "bold",
    color: "#333",
  },
  imagePlaceholder: {
    height: "300px",
    width: "100%",
    backgroundColor: "#D9D9D9",
    marginBottom: "16px",
  },
  descriptionBox: {
    textAlign: "left",
    padding: "8px",
    marginBottom: "16px",
  },
  descriptionText: {
    height: "100px",
    fontFamily: "DM Sans",
    fontSize: "14px",
    margin: "0",
  },
  locationType: {
    fontFamily: "DM Sans",
    fontSize: "18px",
    margin: "0 16px 0 0", // Adjusted margin to ensure spacing on the right
    fontWeight: "bold",
    flexShrink: 0, // Prevents the title from shrinking if space is tight
    color: "#F07F2D",
  },
  address: {
    fontFamily: "DM Sans",
    fontSize: "14px",
    textAlign: "left",
    marginBottom: "16px",
  },
  mapPlaceholder: {
    height: "220px",
    width: "50%",
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    marginLeft: "auto", // This pushes the element to the right
    marginRight: "0", // This ensures it aligns right without any margin on the right side
  },
  locationAndMapContainer: {
    display: "flex",
    alignItems: "flex-start", // Changed to align items at the top
    justifyContent: "space-between", // Adjust if you want a different spacing
    width: "100%", // Ensures the container takes up the full width
  },
};
