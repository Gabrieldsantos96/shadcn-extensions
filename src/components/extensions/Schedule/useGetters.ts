import { Event } from "./useScheduleState";

export interface Getters {
  getDaysInMonth: (
    month: number,
    year: number
  ) => { day: number; events: Event[] }[];
  getEventsForDay: (day: number, currentDate: Date, events: Event[]) => Event[];
  getDaysInWeek: (week: number, year: number, weekStartsOn: string) => Date[];
  getWeekNumber: (date: Date) => number;
  getDayName: (day: number) => string;
  handleEventStyling: (event: Event, dayEvents: Event[]) => any;
}

export function useGetters() {
  const getters: Getters = {
    getDaysInMonth: (month, year) => {
      return Array.from(
        { length: new Date(year, month + 1, 0).getDate() },
        (_, i) => ({
          day: i + 1,
          events: [],
        })
      );
    },
    getEventsForDay: (day, currentDate, events) => {
      return events.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);

        const startOfDay = new Date(currentDate);
        startOfDay.setDate(day);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(currentDate);
        endOfDay.setDate(day + 1);
        endOfDay.setHours(0, 0, 0, 0);

        const isSameDay =
          eventStart.getDate() === day &&
          eventStart.getMonth() === currentDate.getMonth() &&
          eventStart.getFullYear() === currentDate.getFullYear();

        const isSpanningDay = eventStart < endOfDay && eventEnd >= startOfDay;

        return isSameDay || isSpanningDay;
      });
    },
    getDaysInWeek: (week, year, weekStartsOn) => {
      const startDay = weekStartsOn === "sunday" ? 0 : 1;
      const janFirst = new Date(year, 0, 1);
      const janFirstDayOfWeek = janFirst.getDay();
      const weekStart = new Date(janFirst);
      weekStart.setDate(
        janFirst.getDate() +
          (week - 1) * 7 +
          ((startDay - janFirstDayOfWeek + 7) % 7)
      );

      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        return day;
      });
    },
    getWeekNumber: (date) => {
      const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil(
        ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
      );
    },
    getDayName: (day) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],

    handleEventStyling(event: Event, dayEvents: Event[]) {
      const eventsOnHour = dayEvents.filter((e) => {
        return (
          e.startDate < event.endDate && e.endDate > event.startDate // Any overlap
        );
      });

      const numEventsOnHour = eventsOnHour.length || 1;
      const indexOnHour = eventsOnHour.indexOf(event);

      let eventHeight = 0;
      let maxHeight = 0;
      let eventTop = 0;

      if (event.startDate instanceof Date && event.endDate instanceof Date) {
        // Normalize start and end dates to only include hours and minutes
        const startTime =
          event.startDate.getHours() * 60 + event.startDate.getMinutes(); // Convert to minutes
        const endTime =
          event.endDate.getHours() * 60 + event.endDate.getMinutes(); // Convert to minutes

        // Calculate the difference in minutes between start and end times
        const diffInMinutes = endTime - startTime;

        // Calculate the event height based on the duration (64px per hour, so 64px/60min = 1.0667px per minute)
        eventHeight = (diffInMinutes / 60) * 64;
        // console.log("eventHeight", eventHeight);

        // Get the event start hour as a fraction (e.g., 13.5 for 13:30)
        const eventStartHour =
          event.startDate.getHours() + event.startDate.getMinutes() / 60;

        // Define the day-end hour (24.0 for midnight)
        const dayEndHour = 24;

        // Calculate maxHeight based on the difference between the day-end hour and the event's start hour
        maxHeight = Math.max(0, (dayEndHour - eventStartHour) * 64);

        // Limit the event height to the calculated maxHeight (so it doesn’t overflow beyond the day)
        eventHeight = Math.min(eventHeight, maxHeight);

        // Calculate the top position based on the event's start time (64px per hour)
        eventTop = eventStartHour * 64;
      } else {
        console.error("Invalid event or missing start/end dates.");
      }

      return {
        height: `${
          eventHeight < 10
            ? 20
            : eventHeight > maxHeight
            ? maxHeight
            : eventHeight
        }px`,
        top: `${eventTop}px`,
        zIndex: indexOnHour + 1,
        left: `${(indexOnHour * 100) / numEventsOnHour}%`,
        maxWidth: `${100 / numEventsOnHour}%`,
        minWidth: `${100 / numEventsOnHour}%`,
      };
    },
  };

  return getters;
}
