import React from "react";

// eventually connect to data from backend
const eventData = [
  {
    id: 1,
    title: "Event 1",
    location: "Location",
    websiteURL: "Website URL",
    date: { day: "2", month: "February", time: "1:00pm - 2:00pm" },
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 1,
    title: "Event 2",
    location: "Location",
    websiteURL: "Website URL",
    date: { day: "2", month: "February", time: "1:00pm - 2:00pm" },
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

function Event({ title, location, websiteURL, date, description }) {
  const { styles } = useEventBarStyles();

  return (
    <div
      style={{
        ...styles.eventContainer,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ flex: 1 }}>
        {" "}
        <div style={styles.headerContainer}>
          <div style={styles.titleContainer}>
            <h1 style={styles.title}>{title}</h1>
            <p
              style={styles.dateAndTime}
            >{`${date.time} ${date.month} ${date.day}`}</p>
            <div style={styles.tagContainer}>
              <p style={styles.eventTag}>Event Tags</p>
              <p style={{ marginRight: "15px", color: "#335543" }}>
                {location}
              </p>
              <p style={{ marginRight: "15px", color: "#335543" }}>
                {websiteURL}
              </p>
            </div>
          </div>
        </div>
        <div style={styles.eventText}>
          <p>{description}</p>
        </div>
      </div>
      <div
        style={{
          width: "150px",
          height: "150px",
          backgroundColor: "#F07F2D",
          alignSelf: "center",
          borderRadius: "12px",
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
export default function EventBar() {
  const styles = useEventBarStyles();

  return (
    <div style={styles.container}>
      <div style={styles.search}>
        <h1>Search Bar</h1>
      </div>
      <div style={styles.allEventContainer}>
        {eventData.map((event) => (
          <Event key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}

function useEventBarStyles() {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      width: "80%",
    },
    allEventContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    eventContainer: {
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "#ccc",
      borderRadius: "12px",
      whiteSpace: "wrap",
      width: "80%",
      backgroundColor: "white",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      marginBottom: "2%",
      marginLeft: "15%",
    },
    tagContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      flexWrap: "wrap",
    },
    eventTag: {
      marginRight: "15px",
      color: "#F07F2D",
      display: "flex",
      alignItems: "center",
    },
    dateContainer: {
      borderStyle: "solid",
      borderWidth: "1px",
      borderRadius: "16px",
      flexGrow: "1",
      display: "grid",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "30%",
      height: "auto",
    },
    titleContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    title: {
      fontSize: "1.5 rem",
      fontWeight: "bold",
      margin: "0 0 10px 0",
    },
    dateAndTime: {
      marginBottom: "5px",
    },
    eventText: {
      textAlign: "left",
    },
  };

  return { styles };
}
