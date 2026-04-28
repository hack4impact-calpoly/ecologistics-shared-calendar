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
import useSWR, { mutate } from "swr";
import AddEventPanel from "../components/addEventPanel";
import EventRequestPopup from "../components/eventRequestPopup";
import style1 from "../styles/calendar.module.css";
import { useClerk } from "@clerk/clerk-react";
import { EventDocument } from "../database/eventSchema";
import { useRouter } from "next/router";
import { convertEventDatesToDates } from "../utils/events";
import { DateTime } from "luxon";
import { useUser } from "@clerk/clerk-react";
import AddEventLocationPanel from "../components/addEventLocationPanel";

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
  const { user } = useUser();
  const EVENTS_KEY = "/api/users/eventRoutes?status=Approved";
  const { data: eventsData } = useSWR(EVENTS_KEY, (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        convertEventDatesToDates(res.data as EventDocument[]);
        return res.data as EventDocument[];
      }),
  );
  const events: EventDocument[] = eventsData ?? [];
  const [futureEvents, setFutureEvents] = useState<EventDocument[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<
    FullCalenderRecurringEvent[]
  >([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<EventDocument[]>(
    [],
  );
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

  useEffect(() => {
    setFutureEvents(filterFutureEvents(events));
  }, [events]);

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
      })),
    );
  }, [events]);

  // Fetch events from the database
  const handleDateClick = (arg: { dateStr: string }) => {
    const clickedDate = new Date(arg.dateStr);
    console.log(clickedDate);

    const filteredEvents: EventDocument[] = events.filter(
      (event: EventDocument) => {
        const eventStart = DateTime.fromISO(event.startDate.toISOString(), {
          zone: "UTC",
        })
          .setZone("America/Los_Angeles")
          .toISODate();
        const eventEnd = DateTime.fromISO(event.endDate.toISOString(), {
          zone: "UTC",
        })
          .setZone("America/Los_Angeles")
          .toISODate();

        if (!eventStart || !eventEnd) {
          console.log("False");
          return false;
        }

        return (
          clickedDate >= new Date(eventStart) &&
          clickedDate <= new Date(eventEnd)
        );
      },
    );
    console.log(filteredEvents);

    setSelectedDateEvents(filteredEvents);
  };

  const filterFutureEvents = (events: EventDocument[]) => {
    const now = new Date();
    return events
      .filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return (eventStart <= now && eventEnd >= now) || eventStart >= now;
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setSelectedDateEvents(filterFutureEvents(events));
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [events]);

  const addEvent = () => {
    mutate(EVENTS_KEY);
  };

  function adjustButtons() {
    const gridCell = document.querySelector(".fc-daygrid-day");
    const headerCell = document.querySelector(".fc-col-header-cell");

    if (gridCell) {
      const gridCell = document.querySelector(".fc-daygrid-day") as HTMLElement;
      const headerCell = document.querySelector(
        ".fc-col-header-cell",
      ) as HTMLElement;
      const cellWidth = gridCell.offsetWidth * 0.95;
      const cellHeight = headerCell.offsetHeight * 1.5;
      const addButton = document.querySelector(
        ".fc-AddEvent-button",
      ) as HTMLElement;
      if (addButton) {
        addButton.style.width = `${cellWidth}px`;
        addButton.style.height = `${cellHeight * 1.12}px`;
        addButton.style.fontSize = `${cellWidth * 0.15}px`;
      }
      const prevButton = document.querySelector(
        ".fc-prev-button",
      ) as HTMLElement;
      const nextButton = document.querySelector(
        ".fc-next-button",
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
      ".fc-toolbar-title",
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
      {isShowingEventPopUp && user?.publicMetadata?.role != "admin" && (
        <EventRequestPopup onClose={() => setIsShowingEventPopUp(false)} />
      )}
      <div className={style1.calendarPageContainer} ref={calendarRef}>
          <style>{calendarStyles}</style>
          <div style={styles.fullCalendar}>
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
              searchButton: {
            text: "Search events...",
            click: () => {} // no-op
            
            },
            filterButton: {
            text: "Filter",
            click: () => {} // no-op
            }
            }}
            headerToolbar={{
              left: "prev title next",
              center: "",
              right: windowWidth >= 786 ? "searchButton filterButton AddEvent" : "searchButton filterButton ",
            }}
            buttonIcons={{
              prev: "chevron-left",
              next: "chevron-right",
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
          <EventBar
            events={
              selectedDateEvents.length > 0 ? selectedDateEvents : futureEvents
            }
            totalEvents={events}
          />
        ) : (
          <AddEventPanel
            onClose={() => setIsAddingEvent(false)}
            onCreate={() => setIsShowingEventPopUp(true)}
            addEvent={addEvent}
          />)}
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  spaced: {},
  fullCalendar: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "auto",
    borderRadius: "10px", 
    gap: "24px",
    padding: "24px",
    background: "white",
    boxShadow:
      "0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
};

const calendarStyles = `
   .fc .fc-prev-button, .fc .fc-next-button {
     background-color: #FFFFFF;
     border: none;
     color: #0A0A0A;  
     width: 36px;
     height: 36px;
     border-radius: 8px; 
     display: flex;
     align-items: center;
     justify-content: center;
     font-size: 16px;
     line-height: 1;
     padding: 0;
   }

   .fc .fc-prev-button:hover,
   .fc .fc-next-button:hover,
   .fc .fc-AddEvent-button:hover {
     background-color: #eaeaea; 
   }

   .fc-prev-button {
     height: 38px;
     padding: 8px;
   }

   .fc-next-button {
     margin-right: 3%;
     height: 38px;
     padding: 8px;
   }

   .fc-header-toolbar {
     display: flex;
     justify-content: space-between;
     text-transform: uppercase;
     height: 38px;
   }

   .fc .fc-toolbar-title {
     display: flex;
     justify-content: center;
     align-items: center;
     margin-right: 2.5%;
     height: 38px;
     font-size: 32px;
   }

   .fc-toolbar-chunk {
     display: flex;
     align-items: center;
     justify-content: start;
     height: 38px;
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
     height: 44px;
     border: none;
     vertical-align: middle;
   }

   .fc .fc-scrollgrid-sync-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    }

   .fc .fc-AddEvent-button {
     background-color: #F7AB74;
     color: black;
     border-radius: 0.9em;
     border-color: #F7AB74;
     font-size: 1.1em;
     border: none;
     width: 120px; /* Adjust the width as needed */
     height: 38px; /* Adjust the height as needed */
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

   .fc .fc-daygrid-day,
   .fc .fc-daygrid {
     border: 1px solid #ddd;
     border-right: 1px solid #ddd;
   }
  
   .fc .fc-searchButton-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 194px;
    height: 38px;
    background-color: white;
    border-radius: 9999px;
    border: 1px solid #D1D5DC;
    padding: 0 16px;
    font-family: Inter, sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 1;
    letter-spacing: -0.15px;
    color: rgba(10, 10, 10, 0.5);
   }

   .fc .fc-filterButton-button{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 65.56px;
    height: 38px;
    background-color: rgb(229, 231, 235);
    border-radius: 9999px;
    border: none;
    font-family: Inter, sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
    letter-spacing: -0.15px;
    color: rgba(10, 10, 10);
   }
 `;
