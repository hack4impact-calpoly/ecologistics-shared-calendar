import React from "react";
import Layout from "../components/layout";
import StaticMap from "../components/map";

export default function EventPage() {
  const street = "1 Grand Ave";
  const city = "San Luis Obispo";
  const state = "CA";
  const postalCode = "93407";
  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.box}>
          <h1 style={styles.title}>Event Title</h1>
          <p style={styles.date}>Event Date @ Event Time</p>
          <div style={styles.imagePlaceholder}></div>
          {/* <img src="https://calendar-image-storage.s3.amazonaws.com/1714604037955-image_6209779.jpg"/> */}
          <div style={styles.descriptionBox}>
            <p style={styles.descriptionText}>Event Description...</p>
          </div>
          <div style={styles.locationAndMapContainer}>
            <div style={styles.locationTypeContainer}>
              <h2 style={styles.locationType}>Location</h2>
              <address style={styles.address}>
                <p>1 Grand Ave</p>
                <p>San Luis Obispo, CA 93407</p>
              </address>
            </div>
            <div style={styles.mapPlaceholder}>
              <StaticMap
                street={street}
                state={state}
                city={city}
                postalCode={postalCode}
              />
            </div>
          </div>
        </div>
      </div>
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
