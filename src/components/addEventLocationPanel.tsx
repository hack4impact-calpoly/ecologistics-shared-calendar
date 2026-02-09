"use client";
import { useState } from 'react' 

type LocationMode = "in-person" | "virtual";
type InPersonMethod = "pin" | "address" | "search";

export default function AddEventLocationPanel(){

    const [mode, setMode] = useState<LocationMode>("in-person");
    const [method, setMethod] = useState<InPersonMethod>("pin");


    return(
    <div>

    <h2>Create New Event</h2>
    <p>Where will this event take place?</p>

    <button style={mode === "in-person" ? styles.activeModeButton : styles.modeButton} onClick={() => setMode("in-person")}>
        In Person
    </button>
    <button style={mode === "virtual" ? styles.activeModeButton : styles.modeButton} onClick={() => setMode("virtual")}>
        Virtual
    </button>
    
    <h3>Set Event Location</h3>

    {mode == "in-person" && (
        <div>
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