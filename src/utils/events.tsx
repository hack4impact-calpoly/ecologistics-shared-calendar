import { EventDocument } from "../database/eventSchema";

export function getFormattedDate(date: Date): string {
  return `${date.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })} ${date.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit'
  })}`;
}

// Converts the date strings in the events to Date objects.
// Should be called before using the events in the frontend anytime they are fetched.
export function convertEventDatesToDates(events: EventDocument[]): void {
  events.forEach((event) => {
    event.startDate = new Date(event.startDate);
    event.endDate = new Date(event.endDate);
  });
}
