"use client";
import { useState } from "react";
import { AddressAutoFill } from "./addressAutofill";
import MapPin from "./mapPin";

type LocationMode = "in-person" | "virtual";
type InPersonMethod = "pin" | "search";

const geoKey = process.env.GEOAPIFY_API_KEY!;

export default function AddEventLocationPanel({ setPanelType, setEventFormData, eventFormData }) {
  const [mode, setMode] = useState<LocationMode>("in-person"); //active mode
  const [method, setMethod] = useState<InPersonMethod>("pin"); //active method
  const [formData, setFormData] = useState({
    lon: 0,
    lat: 0,
    desc: "",
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Create New Event</h2>
      <p style={styles.subHeader}>Where will this event take place?</p>

      <div style={styles.toggleContainer}>
        {/* activates "active" css for button depending on mode*/}
        <button
          style={
            mode === "in-person" ? styles.activeModeButton : styles.modeButton
          }
          onClick={() => setMode("in-person")}
        >
          In Person
        </button>
        <button
          style={
            mode === "virtual" ? styles.activeModeButton : styles.modeButton
          }
          onClick={() => setMode("virtual")}
        >
          Virtual
        </button>
      </div>

      <h3 style={styles.sectionHeader}>Set Event Location</h3>

      {/* activates "active" css for button depending on method*/}
      {mode == "in-person" && (
        <div style={styles.methodContainer}>
          <button
            style={
              method === "pin" ? styles.activeMethodButton : styles.methodButton
            }
            onClick={() => setMethod("pin")}
          >
            Pin
          </button>
          <button
            style={
              method === "search"
                ? styles.activeMethodButton
                : styles.methodButton
            }
            onClick={() => setMethod("search")}
          >
            Search
          </button>
        </div>
      )}
      {mode === "in-person" && method === "pin" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #989898",
            }}
          >
            <MapPin
              inLon={formData.lon}
              inLat={formData.lat}
              onPickAddress={(data) => {
                setFormData({ ...formData, lon: data.lon, lat: data.lat });
              }}
            />
          </div>

          <input
            type="text"
            style={styles.input}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            value={formData.desc}
            placeholder="Add description of location (optional)"
          />
        </div>
      )}
      {mode === "in-person" && method === "search" && (
        <div>
          <AddressAutoFill
            apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY as string}
            onSelect={(data, addr) => {
              setFormData({ ...formData, lon: data.lon, lat: data.lat });
              setEventFormData((prev) => {
                const updated = {
                  ...prev,
                  street: addr.street,
                  city: addr.city,
                  state: addr.state_code,
                  postalCode: addr.postcode,
                  mode: "in-person"
                };
                console.log("Updated formData:", updated); // check here
                return updated;
              });
            }}
          />
        </div>
      )}
      <button style={styles.button} type="button" onClick={() => setPanelType('misc')}>
        Continue
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    borderRadius: "10px",
    border: "1px solid black",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    margin: "10px",
    width: "80%",
    height: "50%",
    position: "relative",
    gap: "5px",
  },
    button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "20px",
    background: "#335543",
    color: "white",
    cursor: "pointer",
    display: "block",
    width: "15%",
    alignSelf: "center",
  },
  header: {
    margin: 0,
  },
  subHeader: {
    color: "#333",
  },
  toggleContainer: {
    display: "flex",
    background: "#bdbdbd",
    borderRadius: "999px",
    padding: "4px",
  },
  methodContainer: {
    display: "flex",
    gap: "12px",
  },
  modeButton: {
    flex: 1,
    border: "none",
    background: "transparent",
    padding: "10px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 500,
  },
  activeModeButton: {
    flex: 1,
    border: "none",
    padding: "10px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 500,
    background: "#6d6d6d",
    color: "#fff",
  },
  methodButton: {
    flex: 1,
    padding: "20px",
    borderRadius: "12px",
    background: "#f0f0f0",
    textAlign: "center",
    cursor: "pointer",
    border: "2px solid transparent",
  },
  activeMethodButton: {
    flex: 1,
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    cursor: "pointer",
    background: "#b0b0b0",
    border: "2px solid #888",
  },
  input: {
    width: "calc(100% - 20px)",
    padding: "10px",
    borderRadius: "15px",
    background: "rgba(217, 217, 217, 0.3)",
    border: "1px solid #989898",
    color: "black",
  },
};
