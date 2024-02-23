import Layout from "../components/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import EventBar from "./eventBar";


export default function CalendarPage() {
  const styles = {
    pageLayout: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'start',
      padding: '20px',
      margin: '20px',
      whiteSpace: 'nowrap'

    },
    calendar: {
      width: "120%"
    }
  };

  return (
    
      
      <Layout>
        <div style={styles.pageLayout}>
          <div className="calendar-container" style={styles.calendar}>
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
                right: "resourceTimelineWeek,dayGridMonth,timeGridWeek",
              }}
              initialView="resourceTimelineWeek"
              nowIndicator={true}
              editable={true}
              selectable={true}
              selectMirror={true}
              resources={[
                { id: "a", title: "Auditorium A" },
                { id: "b", title: "Auditorium B", eventColor: "green" },
                { id: "c", title: "Auditorium C", eventColor: "orange" },
              ]}
              initialEvents={[
                { title: "nice event", start: new Date(), resourceId: "a" },
              ]}
            />
            
          </div>
          <EventBar></EventBar>
        </div>
      </Layout>
      
      
    
  );
}


