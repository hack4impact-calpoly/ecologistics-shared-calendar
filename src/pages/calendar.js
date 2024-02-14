import Layout from "../components/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [resize, setResize] = useState(false);

  function adjustAddEventButtonWidth() {
    const gridCell = document.querySelector('.fc-daygrid-day');
    const headerCell = document.querySelector('.fc-col-header-cell');

    if (gridCell) {
      const cellWidth = gridCell.offsetWidth * 0.9;
      const cellHeight = headerCell.offsetHeight * 1.5;
      const cellFont = headerCell.offsetFont * 1.5;
  
      const addButton = document.querySelector('.fc-AddEvent-button');
      if (addButton) {
        addButton.style.width = `${cellWidth}px`;
        addButton.style.height = `${cellHeight}px`;
        addButton.style.font = `${cellFont}px`;
      }
    }
  }
  
  function setTitleFontSize() {
    const gridCells = document.querySelectorAll('.fc-daygrid-day');
    const titleElement = document.querySelector('.fc-toolbar-title');
  
    if (gridCells.length > 0 && titleElement) {
      const cellWidth = gridCells[0].offsetWidth;
      const totalWidth = cellWidth * 3;
  
      let fontSize = totalWidth / (titleElement.textContent.length / 2); 
  
      const maxSize = 30;
      fontSize = Math.min(fontSize, maxSize);
  
      titleElement.style.fontSize = `${totalWidth/10}px`;
      titleElement.style.width = `${totalWidth}px`;
    }
  }
  

  useEffect((resize) => {
    adjustAddEventButtonWidth();
    setTitleFontSize();

    window.addEventListener('resize', adjustAddEventButtonWidth);
    window.addEventListener('resize', setTitleFontSize);

    return () => {
      window.removeEventListener('resize', adjustAddEventButtonWidth);
      window.removeEventListener('resize', setTitleFontSize);
    }
  }, [resize]);

  return (
    <Layout>
      <div className="calendar-container">
        <style>{calendarStyles}</style>
        <FullCalendar
          themeSystem='bootstrap5'
          plugins={[
            resourceTimelinePlugin,
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            bootstrap5Plugin
          ]}

          windowResize={function () {
            setResize(!resize);
          }}

          customButtons={{
            AddEvent: {
              text: 'Add Event',
              click: function() {
                alert("clicked");
              },
              hint: 'none',
            }
          }}

          headerToolbar={{
            left: "",
            center: "prev title next",
            right: "AddEvent"
          }}
          buttonIcons={{
            prev: 'bi-arrow-left', 
            next: 'bi-arrow-right'
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
            }
          ]}
          dayHeaderFormat={{ weekday: 'long' }}
        />
      </div>
    </Layout>
  );
}

const calendarStyles = `
  .fc .fc-prev-button, .fc .fc-next-button {
    background-color: #335543;
    border: none;
    color: #FFF;
    font-size: 1.5em;
    border-radius: 2em; 
    line-height: 1;
  }

  .fc .fc-toolbar-title {
    // font-size: 2.5em;
  }

  .fc .fc-prev-button:hover,
  .fc .fc-next-button:hover,
  .fc .fc-AddEvent-button:hover {
    background-color: #eaeaea; 
  }

  .fc-header-toolbar {
    display: flex;
    text-transform: uppercase;
    padding-bottom: 1%;
  }

  .fc-toolbar-chunk:nth-child(2) {
    display: flex;
    text-align: center;
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
    border-radius: 2em;
    // padding: 0.6em 2.1em;
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