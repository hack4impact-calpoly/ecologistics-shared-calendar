import Layout from "../components/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function CalendarPage() {
  return (
    <Layout>
      <div className="calendar-container" style={style.calendarContainer}>
        <FullCalendar
          plugins={[
            resourceTimelinePlugin,
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
          ]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
          }}
          
          initialView="dayGridMonth"
          nowIndicator={true}
          editable={true}
          selectable={true}
          initialEvents={[
            { title: "nice event", start: new Date(), resourceId: "a" },
          ]}
        />
      </div>
    </Layout>
  );
}

const style = {
  calendarContainer: {
    padding: '10px',
  },
};
