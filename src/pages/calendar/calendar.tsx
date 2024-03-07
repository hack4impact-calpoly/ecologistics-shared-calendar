import Layout from "../../components/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import EventBar from "../../components/eventBar";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
import React from "react";
import AddEventPanel from "../../components/addEventPanel";
import Link from "next/link";

interface Event {
  start: Date | string;
  title: string;
  id: string;
}

// If FullCalendar provides a type for the event selection info, use that instead
interface SelectInfo {
  startStr: string; // Add more properties as needed based on the library's documentation
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [resize, setResize] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const handleSelect = (info: { startStr: string }) => {
    const eventNamePrompt = prompt("Enter event name");
    const eventStart = prompt("Enter start time (hh:mm)");
    var startTime = info.startStr.replace(
      "00:00:00 GMT-0800 (Pacific Standard Time)",
      ""
    );
    startTime = startTime + " " + eventStart;
    if (eventNamePrompt) {
      setEvents([
        ...events,
        {
          start: new Date(startTime),
          title: eventNamePrompt,
          id: Math.random().toString(),
        },
      ]);
    }
  };

  function adjustButtons() {
    const gridCell = document.querySelector(".fc-daygrid-day");
    const headerCell = document.querySelector(".fc-col-header-cell");

    if (gridCell) {
      const gridCell = document.querySelector(".fc-daygrid-day") as HTMLElement;
      const headerCell = document.querySelector(
        ".fc-col-header-cell"
      ) as HTMLElement;
      const cellWidth = gridCell.offsetWidth * 0.95;
      const cellHeight = headerCell.offsetHeight * 1.5;
      const addButton = document.querySelector(
        ".fc-AddEvent-button"
      ) as HTMLElement;
      if (addButton) {
        addButton.style.width = `${cellWidth}px`;
        addButton.style.height = `${cellHeight * 0.9}px`;
        console.log(cellHeight);
        addButton.style.fontSize = `${cellHeight * 0.4}px`;
      }
      const prevButton = document.querySelector(
        ".fc-prev-button"
      ) as HTMLElement;
      const nextButton = document.querySelector(
        ".fc-next-button"
      ) as HTMLElement;
      if (prevButton && nextButton) {
        prevButton.style.width = `${cellHeight * 0.9}px`;
        nextButton.style.width = `${cellHeight * 0.9}px`;
        prevButton.style.height = `${cellHeight * 0.9}px`;
        nextButton.style.height = `${cellHeight * 0.9}px`;
      }
    }
  }

  function setTitleFontSize() {
    const gridCells = document.querySelectorAll(".fc-daygrid-day");
    const titleElement = document.querySelector(
      ".fc-toolbar-title"
    ) as HTMLElement;

    if (gridCells.length > 0 && titleElement) {
      const cellWidth = (gridCells[0] as HTMLElement).offsetWidth;
      const totalWidth = cellWidth * 2.9;

      titleElement.style.fontSize = `${totalWidth / 9.5}px`;
      titleElement.style.width = `${totalWidth}px`;
    }
  }

  useEffect(() => {
    adjustButtons();
    setTitleFontSize();
    window.addEventListener("resize", adjustButtons);
    window.addEventListener("resize", setTitleFontSize);
    return () => {
      window.removeEventListener("resize", adjustButtons);
      window.removeEventListener("resize", setTitleFontSize);
    };
  }, [resize]);

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          padding: "0px",
          margin: "0px",
          whiteSpace: "nowrap",
        }}
      >
        <div className="calendar-container">
          <div style={styles.signoutContainer}>
            <Link prefetch={false} href="/login">
              <button
                onMouseOver={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor =
                    "#e69153")
                }
                onMouseOut={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor =
                    "#f7ab74")
                }
                style={{
                  padding: "0.625rem 4.35rem",
                  height: "100%",
                  fontSize: "1.143rem",
                  fontWeight: "500",
                  textDecoration: "none",
                  textAlign: "center",
                  background: "#f7ab74",
                  borderRadius: "0.75rem",
                  border: "0px",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </Link>
            <Link prefetch={false} href="/admin">
              <button
                onMouseOver={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor =
                    "#e69153")
                }
                onMouseOut={(e) =>
                  ((e.target as HTMLButtonElement).style.backgroundColor =
                    "#f7ab74")
                }
                style={{
                  padding: "0.625rem 4.35rem",
                  height: "100%",
                  fontSize: "1.143rem",
                  fontWeight: "500",
                  textDecoration: "none",
                  textAlign: "center",
                  background: "#f7ab74",
                  borderRadius: "0.75rem",
                  border: "0px",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  cursor: "pointer",
                  marginLeft: "1rem",
                }}
              >
                Admin
              </button>
            </Link>
          </div>
          <style>{calendarStyles}</style>

          <FullCalendar
            themeSystem="bootstrap5"
            plugins={[
              resourceTimelinePlugin,
              dayGridPlugin,
              interactionPlugin,
              timeGridPlugin,
              bootstrap5Plugin,
            ]}
            windowResize={function () {
              setResize(!resize);
            }}
            customButtons={{
              AddEvent: {
                text: "Add Event",
                click: function () {
                  setIsAddingEvent((prev) => !prev);
                },
                hint: "none",
              },
            }}
            headerToolbar={{
              left: "",
              center: "prev title next",
              right: "AddEvent",
            }}
            buttonIcons={{
              prev: "arrow-left",
              next: "arrow-right",
            }}
            initialView="dayGridMonth"
            nowIndicator={true}
            editable={true}
            select={handleSelect}
            selectable={true}
            initialEvents={[
              { title: "nice event", start: new Date(), resourceId: "a" },
            ]}
            events={events}
            eventClick={function (info) {
              window.location.href = "/eventDetails";
            }}
            eventColor="#c293ff"
          />
        </div>
        {!isAddingEvent ? (
          <EventBar />
        ) : (
          <AddEventPanel onClose={() => setIsAddingEvent(false)} />
        )}
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  spaced: {},
};

const calendarStyles = `
  .fc .fc-prev-button, .fc .fc-next-button {
    background-color: #335543;
    border: none;
    color: #FFF;
    font-size: 2em;
    font-size: 1.5em;
    border-radius: 50%; 
    line-height: 1;
  }
  
  .fc .fc-prev-button:hover,
  .fc .fc-next-button:hover,
  .fc .fc-AddEvent-button:hover {
    background-color: #eaeaea; 
  }

  .fc-prev-button {
    margin-left: 3%;
  }

  .fc-next-button {
    margin-right: 3%;
  }

  .fc-header-toolbar {
    margin-top: 5%;
    display: flex;
    justify-content: space-between;
    text-transform: uppercase;
    padding-bottom: 1%;
  }
  
  .fc .fc-toolbar-title {
    text-align: center;
    margin-right: 2.5%;
  }
  
  .fc-toolbar-chunk {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fc-toolbar-chunk:nth-child(2) {
    justify-content: center;
  }

  .fc-toolbar-chunk:last-child {
    justify-content: end;
  }

  .fc-col-header-cell {
    background: #335543;
    color: #FFF;
  }
  
  .fc .fc-AddEvent-button {
    background-color: #F7AB74;
    color: black;
    border-radius: 0.9em;
    border-color: #F7AB74;
    font-size: 1.1em;
    border: none;
  }

  .fc .fc-daygrid-event-harness {
    max-width: 100%;
  }

  .fc .fc-event {
    background-color: #F7AB74;
    border-color: #F7AB74;
    color: black;
    border-radius: 1em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 5%;
    padding-right: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  .fc-daygrid-event-dot {
    display: none;
  }

  .fc .fc-col-header-cell,
  .fc .fc-daygrid-day,
  .fc .fc-daygrid {
    border: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
`;
