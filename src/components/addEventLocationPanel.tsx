"use client";
import { useState } from 'react' 

type LocationMode = "in-person" | "virtual";
type InPersonMethod = "pin" | "address" | "search";

export default function AddEventLocationPanel(){

    const [mode, setMode] = useState<LocationMode>("in-person");
    const [method, setMethod] = useState<InPersonMethod>("pin");


    return(
    <div style={styles.container}>

    <h2 style={styles.header}>Create New Event</h2>
    <p style={styles.subHeader}>Where will this event take place?</p>

    <div style={styles.toggleContainer}>

    <button style={mode === "in-person" ? styles.activeModeButton : styles.modeButton} onClick={() => setMode("in-person")}>
        In Person
    </button>
    <button style={mode === "virtual" ? styles.activeModeButton : styles.modeButton} onClick={() => setMode("virtual")}>
        Virtual
    </button>

    </div>
    
    <h3 style={styles.sectionHeader}>Set Event Location</h3>

    {mode == "in-person" && (
        <div style={styles.methodContainer}>
        <button style={method === "pin" ? styles.activeMethodButton : styles.methodButton} onClick={() => setMethod("pin")}>
            Pin
        </button>
        <button style={method === "address" ? styles.activeMethodButton : styles.methodButton} onClick={() => setMethod("address")}>
            Address
        </button>
        <button style={method === "search" ? styles.activeMethodButton : styles.methodButton} onClick={() => setMethod("search")}>
            Search
        </button>

    </div>
    )
    }

    </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
container: {
    width: "100%",
    maxWidth: "550px",
    padding: "20px",
    background: "#e5e5e5",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
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
  }

}