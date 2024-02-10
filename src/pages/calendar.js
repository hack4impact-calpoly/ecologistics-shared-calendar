import Layout from "../components/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function CalendarPage() {
  return (
    <Layout>
      <div className="calendar-container">
      <style>{calendarStyles}</style>
        <FullCalendar
          plugins={[
            resourceTimelinePlugin,
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
          ]}
          customButtons={{
            AddEvent: {
              text: 'Add Event',
              click: function() {
                alert("clicked");
              },
            }
          }}

          headerToolbar={{
            left: "",
            center: "prev title next",
            right: "AddEvent"
          }}
          
          initialView="dayGridMonth"
          nowIndicator={true}
          editable={true}
          selectable={true}
          initialEvents={[
            { 
              title: "nice event", 
              start: new Date(), 
              resourceId: "a",
              display: "auto"
            },
          ]}
        />
      </div>
    </Layout>
  );
}

const calendarStyles = `
  .fc-header-toolbar {
    display: flex;
    text-transform: uppercase;
  }

  .fc-toolbar-chunk:nth-child(2) {
    display: flex;
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
    border-radius: 1em;
    padding: 0.5em 1em;
    border-color: #F7AB74;
    font-size: 1em;
  }

  .fc .fc-daygrid-event-harness {
    max-width: 100%;
  }

  .fc-event {
    background-color: #F7AB74;
    border: none; 
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

`;