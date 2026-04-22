"use client";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { AddressAutoFill } from "./addressAutofill";
import MapPin from "./mapPin";
import { AddEventFormType } from "./addEventPanel";

type LocationMode = "in-person" | "virtual";
type InPersonMethod = "pin" | "search";

const geoKey = process.env.GEOAPIFY_API_KEY!;

type AddEventLocationPanelProps = {
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
  setEventFormData: React.Dispatch<React.SetStateAction<AddEventFormType>>;
  eventFormData: AddEventFormType;
  error?: string;
};

export default function AddEventLocationPanel({
  onBack,
  onClose,
  onContinue,
  setEventFormData,
  eventFormData,
  error,
}: AddEventLocationPanelProps) {
  const [mode, setMode] = useState<LocationMode>(
    eventFormData.mode === "virtual" ? "virtual" : "in-person",
  ); //active mode
  const [method, setMethod] = useState<InPersonMethod>("pin"); //active method
  const [formData, setFormData] = useState({
    lon: 0,
    lat: 0,
    desc: "",
  });

  // Keep the parent state in sync so validation can run in one place.
  const setLocationMode = (nextMode: LocationMode) => {
    setMode(nextMode);
    setEventFormData((prev) => ({
      ...prev,
      mode: nextMode,
      isVirtual: nextMode === "virtual",
    }));
  };

  return (
    <div style={styles.container}>
      <style>{`
        .event-input::placeholder {
          color: #aaa;
        }
      `}</style>
      <MdArrowBack onClick={onBack} style={styles.back} size={25} />
      <MdClose onClick={onClose} style={styles.close} size={25} />
      <h2 style={styles.header}>Create New Event</h2>
      <p style={styles.subHeader}>Where will this event take place?</p>

      <div style={styles.toggleContainer}>
        {/* activates "active" css for button depending on mode*/}
        <button
          style={
            mode === "in-person" ? styles.activeModeButton : styles.modeButton
          }
          onClick={() => setLocationMode("in-person")}
        >
          In Person
        </button>
        <button
          style={
            mode === "virtual" ? styles.activeModeButton : styles.modeButton
          }
          onClick={() => setLocationMode("virtual")}
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
                setEventFormData((prev) => ({
                  ...prev,
                  mode: "in-person",
                  isVirtual: false,
                  latitude: data.lat,
                  longitude: data.lon,
                }));
              }}
            />
          </div>

          <input
            type="text"
            style={styles.input}
            className="event-input"
            onChange={(e) => {
              setFormData({ ...formData, desc: e.target.value });
              setEventFormData((prev) => ({
                ...prev,
                mode: "in-person",
                isVirtual: false,
                locationDescription: e.target.value,
              }));
            }}
            value={formData.desc}
            placeholder="Add description of location (optional)"
          />
        </div>
      )}
      {mode === "in-person" && method === "search" && (
        <div>
          <AddressAutoFill
            apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY as string}
            onSelect={(data, feature) => {
              setFormData({ ...formData, lon: data.lon, lat: data.lat });
              setEventFormData((prev) => ({
                  ...prev,
                  street: (feature.properties.street ?? "") as string,
                  city: (feature.properties.city ?? "") as string,
                  state: (feature.properties.state_code ?? "") as string,
                  postalCode: (feature.properties.postcode ?? "") as string,
                  latitude: data.lat,
                  longitude: data.lon,
                  mode: mode,
                  isVirtual: false,
              }));
            }}
          />
        </div>
      )}
      {mode === "virtual" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <p style={styles.fieldLabel}>Meeting Link <span style={{ color: "red" }}>*</span></p>
            <input
              type="url"
              style={styles.input}
              className="event-input"
              placeholder="https://zoom.us/j/..."
              value={eventFormData.url ?? ""}
              onChange={(e) =>
                setEventFormData((prev) => ({
                  ...prev,
                  mode: "virtual",
                  isVirtual: true,
                  url: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <p style={styles.fieldLabel}>Meeting ID <span style={styles.optionalTag}>(optional)</span></p>
            <input
              type="text"
              style={styles.input}
              className="event-input"
              placeholder="123 456 7890"
              value={eventFormData.virtualMeetingId ?? ""}
              onChange={(e) =>
                setEventFormData((prev) => ({
                  ...prev,
                  virtualMeetingId: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <p style={styles.fieldLabel}>Password <span style={styles.optionalTag}>(optional)</span></p>
            <input
              type="text"
              style={styles.input}
              className="event-input"
              placeholder="Meeting password"
              value={eventFormData.virtualPassword ?? ""}
              onChange={(e) =>
                setEventFormData((prev) => ({
                  ...prev,
                  virtualPassword: e.target.value,
                }))
              }
            />
          </div>
        </div>
      )}
      <div style={styles.errorBox}>{error && <p style={styles.error}>{error}</p>}</div>

      <div style={styles.actions}>
        <button style={styles.button} type="button" onClick={onContinue}>
          Continue
        </button>
      </div>
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
    borderRadius: "0.625rem",
    border: "1px solid black",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "1.25rem",
    margin: "0.625rem",
    width: "80%",
    height: "50%",
    position: "relative",
    gap: "0.3125rem",
  },
  button: {
    padding: "0.625rem 0.9375rem",
    border: "none",
    borderRadius: "1.25rem",
    background: "#335543",
    color: "white",
    cursor: "pointer",
    display: "block",
    minWidth: "7.5rem",
  },
  header: {
    margin: "1.25rem 0 0 0",
  },
  subHeader: {
    color: "#333",
  },
  toggleContainer: {
    display: "flex",
    background: "#bdbdbd",
    borderRadius: "999px",
    padding: "0.25rem",
  },
  methodContainer: {
    display: "flex",
    gap: "0.75rem",
  },
  modeButton: {
    flex: 1,
    border: "none",
    background: "transparent",
    padding: "0.625rem",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 500,
  },
  activeModeButton: {
    flex: 1,
    border: "none",
    padding: "0.625rem",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 500,
    background: "#6d6d6d",
    color: "#fff",
  },
  methodButton: {
    flex: 1,
    padding: "1.25rem",
    borderRadius: "0.75rem",
    background: "#f0f0f0",
    textAlign: "center",
    cursor: "pointer",
    border: "2px solid transparent",
  },
  activeMethodButton: {
    flex: 1,
    padding: "1.25rem",
    borderRadius: "0.75rem",
    textAlign: "center",
    cursor: "pointer",
    background: "#b0b0b0",
    border: "2px solid #888",
  },
  input: {
    width: "calc(100% - 20px)",
    padding: "0.625rem",
    borderRadius: "0.9375rem",
    background: "rgba(217, 217, 217, 0.3)",
    border: "1px solid #989898",
    color: "black",
  },
  error: {
    color: "red",
    alignSelf: "center",
    margin: 0,
    fontSize: "1rem",
  },
  errorBox: {
    minHeight: "1.25rem",
    display: "flex",
    justifyContent: "center",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "0.75rem",
  },
  close: {
    position: "absolute",
    top: "0.5rem",
    right: "0",
    margin: "0.3125rem",
    cursor: "pointer",
  },
  back: {
    position: "absolute",
    top: "0.5rem",
    left: "0",
    margin: "0.3125rem",
    cursor: "pointer",
  },
  fieldLabel: {
    margin: "0 0 0.25rem 0.25rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#333",
  },
  optionalTag: {
    fontWeight: 400,
    color: "#888",
    fontSize: "0.8rem",
  },
};
