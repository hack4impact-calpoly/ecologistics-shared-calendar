import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function CalendarPage() {
  // State to manage selected days
  const [selectedDays, setSelectedDays] = useState([]);


  useEffect(() => {
    // Add checkboxes to day cells
    const dayElements = document.querySelectorAll(".fc-day");
    dayElements.forEach((dayElement) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.marginTop = "5px"; // Adjust styling as needed
      dayElement.appendChild(checkbox);

      const date = dayElement.getAttribute("data-date");
      checkbox.addEventListener("change", () => {
        // Toggle selection when checkbox is changed
        setSelectedDays((prevSelectedDays) => {
          if (checkbox.checked) {
            return [...prevSelectedDays, date];
          } else {
            return prevSelectedDays.filter((day) => day !== date);
          }
        });
      });
    });
  }, []); 

  return (
    <Layout>
      <div className="calendar-container">
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
          dayCellContent={(info) => {
            // Access the date associated with the day cell
            const date = info.date.toISOString().split("T")[0];

            // Check if the day cell element is selected
            const isSelected = selectedDays.includes(date);

            return (
              <span
                id={`fc-day-span-${info.date.toISOString()}`}
                onClick={() => {
                  // Toggle selection when clicking on the day cell
                  setSelectedDays((prevSelectedDays) => {
                    if (isSelected) {
                      return prevSelectedDays.filter((day) => day !== date);
                    } else {
                      return [...prevSelectedDays, date];
                    }
                  });
                }}
              >
                {info.dayNumberText}
              </span>
            );
          }}
          initialView="dayGridMonth"
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
    </Layout>
  );
}
