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
              }
            }
          }}

          headerToolbar={{
            left: "prev, title",
            center: "next",
            right: "next AddEvent"
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
  }

  .fc-toolbar-chunk:first-child {
    display: flex;
    background: blue;
  }


  .fc-toolbar-chunk:nth-child(2) {
    display: inline-block;
    background: blue;
  }

  .fc-toolbar-chunk:last-child {
    justify-content: end;
    background: blue;
  }

  .fc-col-header-cell {
    background: #335543;
    color: #FFF;
  }

  .fc-event {
    background-color: #F07F2D;
    border: none; 
    color: black;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 5%;
    padding-right: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fc-daygrid-event-dot {
    display: none;
  }
`;
