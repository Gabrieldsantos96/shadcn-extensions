"use client";

import { Event, ScheduleView } from "../useScheduleState";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../../Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import EventStyled from "../EventStyle";

const hours = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DailyView({
  events,
  onEvent,
  ...getters
}: ScheduleView) {
  const hoursColumnRef = useRef<HTMLDivElement>(null);
  const [detailedHour, setDetailedHour] = useState<string | null>(null);
  const [timelinePosition, setTimelinePosition] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

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
    setTimelinePosition(y);
  };

  const getFormattedDayTitle = () => currentDate.toDateString();

  const dayEvents = getters.getEventsForDay(
    currentDate?.getDate() || 0,
    currentDate,
    events
  );

  function handleAddEvent(event?: Pick<Event, "endDate" | "startDate">) {
    onEvent({
      startDate: event?.startDate || new Date(),
      endDate: event?.endDate || new Date(),
    });
  }

  function handleAddEventDay(detailedHour: string) {
    if (!detailedHour) {
      console.error("Detailed hour not provided.");
      return;
    }
    const [hours, minutes] = detailedHour.split(":").map(Number);
    const chosenDay = currentDate.getDate();

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

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const handlePrevDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDay);
  };

  return (
    <div className="">
      <div className="flex justify-between gap-3 flex-wrap mb-5">
        <h1 className="text-3xl font-semibold mb-4">
          {getFormattedDayTitle()}
        </h1>

        <div className="flex ml-auto  gap-3">
          <Button onClick={handlePrevDay}>
            <ArrowLeft />
            Prev
          </Button>

          <Button onClick={handleNextDay}>
            <ArrowRight /> Next
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="all-day-events">
          <AnimatePresence mode="wait">
            {dayEvents && dayEvents?.length
              ? dayEvents?.map((event, eventIndex) => {
                  return (
                    <div key={`event-${event.id}-${eventIndex}`}>
                      <EventStyled
                        event={{
                          ...event,
                          minmized: false,
                        }}
                      />
                    </div>
                  );
                })
              : "No events for today"}
          </AnimatePresence>
        </div>

        <div className="relative rounded-md bg-default-50 hover:bg-default-100 transition duration-400">
          <motion.div
            className="relative rounded-xl flex ease-in-out"
            ref={hoursColumnRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setDetailedHour(null)}
          >
            <div className="flex  flex-col">
              {hours.map((hour, index) => (
                <motion.div
                  key={`hour-${index}`}
                  variants={itemVariants}
                  className="cursor-pointer   transition duration-300  p-4 h-[64px] text-left text-sm text-muted-foreground border-default-200"
                >
                  {hour}
                </motion.div>
              ))}
            </div>
            <div className="flex relative flex-grow flex-col ">
              {Array.from({ length: 24 }).map((_, index) => (
                <div
                  onClick={() => {
                    handleAddEventDay(detailedHour as string);
                  }}
                  key={`hour-${index}`}
                  className="cursor-pointer w-full relative border-b  hover:bg-default-200/50  transition duration-300  p-4 h-[64px] text-left text-sm text-muted-foreground border-default-200"
                >
                  <div className="absolute bg-default-200 flex items-center justify-center text-xs opacity-0 transition left-0 top-0 duration-250 hover:opacity-100 w-full h-full">
                    Add Event
                  </div>
                </div>
              ))}
              <AnimatePresence mode="wait">
                {dayEvents && dayEvents?.length
                  ? dayEvents?.map((event, eventIndex) => {
                      const { height, left, maxWidth, minWidth, top } =
                        getters.handleEventStyling(event, dayEvents);
                      return (
                        <div
                          key={`event-${event.id}-${eventIndex}`}
                          style={{
                            minHeight: height,
                            top: top,
                            left: left,
                            maxWidth: maxWidth,
                            minWidth: minWidth,
                          }}
                          className="flex transition-all duration-1000 flex-grow flex-col z-50 absolute"
                        >
                          <EventStyled
                            event={{
                              ...event,
                              minmized: true,
                            }}
                          />
                        </div>
                      );
                    })
                  : ""}
              </AnimatePresence>
            </div>
          </motion.div>

          {detailedHour && (
            <div
              className="absolute left-[50px] w-[calc(100%-53px)] h-[3px]  bg-primary-300 dark:bg-primary/30 rounded-full pointer-events-none"
              style={{ top: `${timelinePosition}px` }}
            >
              <Button
                color="success"
                className="absolute vertical-abs-center z-50 left-[-55px] text-xs uppercase"
              >
                {detailedHour}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
