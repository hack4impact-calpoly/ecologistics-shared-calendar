import Layout from "../components/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import EventBar from "./eventBar";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
export default function CalendarPage() {
  const styles = {
    pageLayout: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      padding: "20px",
      margin: "20px",
      whiteSpace: "nowrap",
    },
    calendar: {
      width: "120%",
    },
  };

  //for adding events
  const [events, setEvents] = useState([]);
  const handleSelect = (info) => {
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

  //styling
  const [resize, setResize] = useState(false);

  function adjustButtons() {
    const gridCell = document.querySelector(".fc-daygrid-day");
    const headerCell = document.querySelector(".fc-col-header-cell");

    if (gridCell) {
      const cellWidth = gridCell.offsetWidth * 0.95;
      const cellHeight = headerCell.offsetHeight * 1.5;
      const cellFont = headerCell.offsetFont * 1.5;

      const addButton = document.querySelector(".fc-AddEvent-button");
      if (addButton) {
        addButton.style.width = `${cellWidth}px`;
        addButton.style.height = `${cellHeight * 1.1}px`;
        addButton.style.font = `${cellFont}px`;
      }
      const prevButton = document.querySelector(".fc-prev-button");
      const nextButton = document.querySelector(".fc-next-button");
      if (prevButton && nextButton) {
        prevButton.style.width = `${cellHeight}px`;
        nextButton.style.width = `${cellHeight}px`;
        prevButton.style.height = `${cellHeight}px`;
        nextButton.style.height = `${cellHeight}px`;
      }
    }
  }

  function setTitleFontSize() {
    const gridCells = document.querySelectorAll(".fc-daygrid-day");
    const titleElement = document.querySelector(".fc-toolbar-title");

    if (gridCells.length > 0 && titleElement) {
      const cellWidth = gridCells[0].offsetWidth;
      const totalWidth = cellWidth * 2.9;

      titleElement.style.fontSize = `${totalWidth / 9.5}px`;
      titleElement.style.width = `${totalWidth}px`;
    }
  }

  useEffect(
    (resize) => {
      adjustButtons();
      setTitleFontSize();

      window.addEventListener("resize", adjustButtons);
      window.addEventListener("resize", setTitleFontSize);

      return () => {
        window.removeEventListener("resize", adjustButtons);
        window.removeEventListener("resize", setTitleFontSize);
      };
    },
    [resize]
  );
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
                  alert("clicked");
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
              alert(
                "Event: " + info.event.title + "\nTime: " + info.event.start
              );
            }}
            eventColor="#c293ff"
          />
        </div>
        <EventBar />
      </div>
    </Layout>
  );
}

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
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
    position: absolute;
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
