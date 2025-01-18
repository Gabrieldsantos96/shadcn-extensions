import React, { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import EventStyled from "@/components/extensions/Schedule/EventStyle";
import { Button } from "@/components/extensions/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { Event, ScheduleView } from "../useScheduleState";
const hours = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

export default function WeeklyView({
  events,
  onEvent,
  ...getters
}: ScheduleView) {
  const hoursColumnRef = useRef<HTMLDivElement>(null);
  const [detailedHour, setDetailedHour] = useState<string | null>(null);
  const [timelinePosition, setTimelinePosition] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const daysOfWeek = getters.getDaysInWeek(
    getters?.getWeekNumber(currentDate),
    currentDate.getFullYear(),
    ""
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hourHeight = rect.height / 24;
    const hour = Math.max(0, Math.min(23, Math.floor(y / hourHeight)));
    const minuteFraction = (y % hourHeight) / hourHeight;
    const minutes = Math.floor(minuteFraction * 60);
    setDetailedHour(
      `${hour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
    setTimelinePosition(y + 83);
  };

  function handleAddEvent(event?: Pick<Event, "endDate" | "startDate">) {
    onEvent({
      startDate: event?.startDate || new Date(),
      endDate: event?.endDate || new Date(),
    });
  }

  const handleNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const handlePrevWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  function handleAddEventWeek(dayIndex: number, detailedHour: string) {
    if (!detailedHour) {
      console.error("Detailed hour not provided.");
      return;
    }

    const [hours, minutes] = detailedHour.split(":").map(Number);
    const chosenDay = daysOfWeek[dayIndex % 7].getDate();

    if (chosenDay < 1 || chosenDay > 31) {
      console.error("Invalid day selected:", chosenDay);
      return;
    }

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      chosenDay,
      hours,
      minutes
    );

    handleAddEvent({
      startDate: date,
      endDate: new Date(date.getTime() + 60 * 60 * 1000),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex ml-auto gap-3">
        <Button onClick={handlePrevWeek}>
          <ArrowLeft />
          Prev
        </Button>

        <Button onClick={handleNextWeek}>
          Next
          <ArrowRight />
        </Button>
      </div>
      <div
        key={currentDate.toDateString()}
        className="grid use-automation-zoom-in grid-cols-8 gap-0"
      >
        <div className="sticky top-0 left-0 z-30 bg-default-100 rounded-tl-lg h-full border-0  flex items-center justify-center">
          <span className="text-lg font-semibold text-muted-foreground">
            Week {getters.getWeekNumber(currentDate)}
          </span>
        </div>

        <div className="col-span-7 flex flex-col relative">
          <div className="grid grid-cols-7 gap-0 flex-grow">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="relative flex flex-col">
                <div className="sticky bg-default-100 top-0 z-20 flex-grow flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-lg font-semibold">
                      {getters.getDayName(day.getDay())}
                    </div>
                    <div
                      className={clsx(
                        "text-lg font-semibold",
                        new Date().getDate() === day.getDate() &&
                          new Date().getMonth() === currentDate.getMonth() &&
                          new Date().getFullYear() === currentDate.getFullYear()
                          ? "text-secondary-500"
                          : ""
                      )}
                    >
                      {day.getDate()}
                    </div>
                  </div>
                </div>
                <div className="absolute top-12 right-0 w-px h-[calc(100%-3rem)]"></div>
              </div>
            ))}
          </div>

          {detailedHour && (
            <div
              className="absolute flex z-10 left-0 w-full h-[3px] bg-primary-300 dark:bg-primary/30 rounded-full pointer-events-none"
              style={{ top: `${timelinePosition}px` }}
            >
              <div
                color="success"
                className="absolute vertical-abs-center z-50 left-[-55px] text-xs uppercase"
              >
                {detailedHour}
              </div>
            </div>
          )}
        </div>

        <div
          ref={hoursColumnRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setDetailedHour(null)}
          className="relative grid grid-cols-8 col-span-8"
        >
          <div className="col-span-1 bg-default-50 hover:bg-default-100 transition duration-400">
            {hours.map((hour, index) => (
              <div
                key={`hour-${index}`}
                className="cursor-pointer border-b border-default-200 p-[16px] h-[64px] text-center text-sm text-muted-foreground border-r"
              >
                {hour}
              </div>
            ))}
          </div>

          <div className="col-span-7 bg-default-50 grid h-full grid-cols-7">
            {Array.from({ length: 7 }, (_, dayIndex) => {
              const dayEvents = getters.getEventsForDay(
                daysOfWeek[dayIndex % 7].getDate(),
                currentDate,
                events
              );

              return (
                <div
                  key={`day-${dayIndex}`}
                  className="col-span-1  border-default-200 z-20 relative transition duration-300 cursor-pointer border-r border-b text-center text-sm text-muted-foreground"
                  onClick={() => {
                    handleAddEventWeek(dayIndex, detailedHour as string);
                  }}
                >
                  <AnimatePresence mode="wait">
                    {dayEvents?.map((event, eventIndex) => {
                      const { height, left, maxWidth, minWidth, top } =
                        getters.handleEventStyling(event, dayEvents);

                      return (
                        <div
                          key={`event-${event.id}-${eventIndex}`}
                          style={{
                            minHeight: height,
                            height,
                            top: top,
                            left: left,
                            maxWidth: maxWidth,
                            minWidth: minWidth,
                          }}
                          className="flex transitio transition-all duration-1000 flex-grow flex-col z-50 absolute"
                        >
                          <EventStyled
                            event={{
                              ...event,
                              minmized: true,
                            }}
                          />
                        </div>
                      );
                    })}
                  </AnimatePresence>
                  {/* Render hour slots */}
                  {Array.from({ length: 24 }, (_, hourIndex) => (
                    <div
                      key={`day-${dayIndex}-hour-${hourIndex}`}
                      className="col-span-1 border-default-200 h-16 z-20 relative transition duration-300 cursor-pointer border-r border-b text-center text-sm text-muted-foreground"
                    >
                      <div className="absolute bg-default-100 flex items-center justify-center text-xs opacity-0 transition duration-250 hover:opacity-100 w-full h-full">
                        Add Event
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}