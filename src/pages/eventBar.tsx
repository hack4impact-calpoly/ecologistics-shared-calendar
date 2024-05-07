import React from "react";
import CircleIcon from "@mui/icons-material/Circle";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";

import { useRouter } from "next/router";
import { EventDocument } from "@/database/eventSchema";
import { getFormattedDate } from "../utils/events";

function Event(event: EventDocument) {
  const { styles } = useEventBarStyles();
  const [isHovered, setIsHovered] = React.useState(false);

  const router = useRouter(); // Create a router instance

  // Function to navigate to event details
  const navigateToEventDetails = () => {
    router.push("/eventDetails/?eventId=" + event._id);
  };

  return (
    <div
      style={{
        ...styles.eventContainer,
        cursor: "pointer", // Change cursor to pointer
        border: isHovered
          ? "2px solid var(--eco-green)"
          : "1.5px solid var(--Grey, #989898)", // Change border on hover
      }}
      onClick={navigateToEventDetails}
      onMouseEnter={() => setIsHovered(true)} // Set isHovered to true when mouse enters
      onMouseLeave={() => setIsHovered(false)} // Set isHovered to false when mouse leaves
    >
      <div style={styles.headerContainer}>
        <div style={styles.title}>{event.title}</div>
        <div style={styles.dateContainer}>
          {getFormattedDate(event.startDate)}
        </div>
        <div style={styles.tagContainer}>
          <PlaceOutlinedIcon
            style={{
              ...styles.icon,
              fontSize: "medium",
              color: "#335543",
            }}
          />
          <div style={styles.eventTag}>{event.isVirtual ? "Virtual" : "In Person"}</div>
          <CircleIcon style={{ ...styles.icon, color: "#F07F2D" }} />
          <div style={{ ...styles.eventTag, color: "#F07F2D" }}>{event.organization}</div>
        </div>
        <div style={styles.eventText}>{event.description}</div>
      </div>
      <div
        style={{
          width: "10.73029rem",
          height: "10.09621rem",
          backgroundColor: "#F07F2D",
          alignSelf: "center",
          borderRadius: "1rem",
        }}
      >
        {" "}
        {/* Image placeholder */}
        {/* If you have an image URL you can use an <img> tag here */}
      </div>
    </div>
  );
}

// Main EventBar Component
export default function EventBar({ events }: { events: EventDocument[] }) {
  const styles = useEventBarStyles();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          margin: "0 0 4% 0",
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          style={{
            boxSizing: "border-box",
            width: "85%",
            padding: "2% 2%",
            fontSize: "1.3rem",
            borderRadius: "1rem",
            border: "0.1rem solid #ccc",
            outline: "none",
            boxShadow: "0 1rem 1rem rgba(0,0,0,0.1)",
            marginTop: "70px",
          }}

          // Add onChange event handler if you want to capture input
          // onChange={handleSearchChange}
        />
      </div>
      <div style={styles.styles.mainContainer}>
        {/* add icon here */}

        {events.map((event) => (
          <Event key={event._id} {...event} />
        ))}
      </div>
    </div>
  );
}

function useEventBarStyles() {
  const styles: { [key: string]: React.CSSProperties } = {
    mainContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      overflowY: "auto",
      maxHeight: "calc(100vh - 200px)",
      width: "100%",
      gap: "1rem",
      padding: "1rem 0",
      boxSizing: "border-box",
    },

    eventContainer: {
      display: "flex",
      flexDirection: "row", //change
      justifyContent: "space-evenly",
      alignItems: "center",
      boxSizing: "border-box",
      border: "1.5px solid var(--Grey, #989898)",
      borderRadius: "0.51213rem",
      whiteSpace: "normal",
      width: "85%",
      height: "30%",
      padding: "2%",
      backgroundColor: "white",
      boxShadow: "0px 2.731px 2.731px 0px rgba(0, 0, 0, 0.25)",
      margin: "1%",
    },
    tagContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center", //change
      flexWrap: "wrap",
      height: "10%",
    },
    eventTag: {
      marginRight: "1.5rem",
      fontSize: "0.78036rem",
    },
    title: {
      fontSize: "1.95093rem",
      fontWeight: "700",
    },
    dateAndTime: {
      marginBottom: "1rem",
      fontSize: "0.9755rem",
    },
    eventText: {
      textAlign: "center", //change
      overflow: "scroll",
      fontSize: "0.78036rem",
    },
    headerContainer: {
      width: "65%",
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      alignItems: "center",
      gap: "1%",
    },
    icon: {
      fontSize: "45%",
      marginRight: "3px",
    },
  };

  return { styles };
}
