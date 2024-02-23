import Layout from "../components/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState } from "react";
import EventBar from "./eventBar";

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


export default function CalendarPage() {

  const [events, setEvents] = useState([]);
  const handleSelect = (info) => {
    const eventNamePrompt = prompt("Enter event name");
    const eventStart=prompt("Enter start time (hh:mm)");
    var startTime = info.startStr.replace("00:00:00 GMT-0800 (Pacific Standard Time)","")
    startTime=startTime+" "+eventStart
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
          select={handleSelect}
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
          events={events}
          eventClick={
            function(info){
              alert('Event: ' + info.event.title+ '\nTime: '+info.event.start)
            
            }
          }
          
          eventColor="#c293ff"
         
        />
      </div>
<EventBar></EventBar>
        </div>
    </Layout>
    
  );
}


