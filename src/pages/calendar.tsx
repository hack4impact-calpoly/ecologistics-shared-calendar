import Layout from "../components/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import EventBar from "./eventBar";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState, useRef } from "react";
import React from "react";
import AddEventPanel from "../components/addEventPanel";
import Link from "next/link";
import EventRequestPopup from "../components/eventRequestPopup";
import style1 from "../styles/calendar.module.css";
import { useClerk } from "@clerk/clerk-react";
import { EventDocument } from "database/eventSchema";
import { useRouter } from "next/router";
import { convertEventDatesToDates } from "../utils/events";
import Navbar from "../components/navbar";
import { DateTime } from "luxon";

// Recurring because events may span multiple days.
// This still works for single-day events.
export interface FullCalenderRecurringEvent {
  startRecur: Date;
  endRecur: Date;
}

export interface Event {
  startDate: Date;
  endDate: Date;
  title: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<FullCalenderRecurringEvent[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<EventDocument[]>([]);
  const [resize, setResize] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isShowingEventPopUp, setIsShowingEventPopUp] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const { signOut } = useClerk();
  const router = useRouter();
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const handleLogout = async () => {
    try {
      // Call signOut function to log out the current user
      await signOut();
      // Redirect to a different page after logout if needed
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

useEffect(() => {
  if (!events) return;
  setCalendarEvents(
    events.map((event) => ({
      startRecur: event.startDate,
      endRecur: event.endDate,
      title: event.title,
      id: event._id,
    }))
  );
}, [events]);

  // Fetch events from the database
  useEffect(() => {
    fetch("/api/users/eventRoutes?status=Approved")
      .then((res) => res.json())
      .then((res) => {
        convertEventDatesToDates(res.data as EventDocument[]);
        setEvents(res.data as EventDocument[]);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const handleDateClick = (arg: { dateStr: string }) => {
    const clickedDate = new Date(arg.dateStr);
  
    const filteredEvents: EventDocument[] = events.filter((event: EventDocument) => {
      const eventStart = DateTime.fromISO(event.startDate.toISOString(), { zone: 'UTC' })
        .setZone('America/Los_Angeles')
        .toISODate();
      const eventEnd = DateTime.fromISO(event.endDate.toISOString(), { zone: 'UTC' })
        .setZone('America/Los_Angeles')
        .toISODate();
  
      if (!eventStart || !eventEnd) {
        return false;
      }
  
      return clickedDate >= new Date(eventStart) && clickedDate <= new Date(eventEnd);
    });
  
    setSelectedDateEvents(filteredEvents);
  };
  

  const handleOutsideClick = (event: MouseEvent) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
      setSelectedDateEvents([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const addEvent = (event: Event) => {};

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
        addButton.style.height = `${cellHeight * 1.12}px`;
        addButton.style.fontSize = `${cellWidth * 0.15}px`;
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
      {isShowingEventPopUp && (
        <EventRequestPopup onClose={() => setIsShowingEventPopUp(false)} />
      )}
      <Navbar />
      <div className={style1.calendarPageContainer} ref={calendarRef}>
        <div className="calendar-container">
          <div style={styles.signoutContainer}></div>
          <style>{calendarStyles}</style>
          <FullCalendar
            themeSystem="bootstrap5"
            plugins={[
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
              right: windowWidth >= 786 ? "AddEvent" : "",
            }}
            buttonIcons={{
              prev: "arrow-left",
              next: "arrow-right",
            }}
            initialView="dayGridMonth"
            nowIndicator={true}
            editable={true}
            select={() => {}}
            selectable={true}
            events={calendarEvents}
            dateClick={handleDateClick}
            eventClick={function (info) {
              router.push({
                pathname: "/eventDetails",
                query: {
                  eventId: info.event.id,
                },
              });
            }}
	    eventTextColor="black"
	    eventBackgroundColor="#F7AB74"
          />
        </div>
        {windowWidth < 786 && (
          <button
            className={style1.addButton}
            style={{ display: "block", margin: "20px auto 0" }}
            onClick={() => setIsAddingEvent((prev) => !prev)}
          >
            Add Event
          </button>
        )}
        {!isAddingEvent ? (
          <EventBar events={selectedDateEvents.length > 0 ? selectedDateEvents : events} />
        ) : (
          <AddEventPanel
            onClose={() => setIsAddingEvent(false)}
            onCreate={() => setIsShowingEventPopUp(true)}
            addEvent={addEvent}
          />
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
     width: 120px; /* Adjust the width as needed */
     height: 40px; /* Adjust the height as needed */
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
     display: block;
   }

   .fc-daygrid-event {
  white-space: normal !important;
  align-items: normal !important;
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
