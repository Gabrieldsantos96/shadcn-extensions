"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import EventStyled from "./EventStyle";
import { IEvent, ScheduleView } from "./ISchedule";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

function DailyView({ events, onEvent, ...getters }: ScheduleView) {
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

  function handleAddEvent(event?: Partial<IEvent>) {
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

  console.log("dayEvents", dayEvents);

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

function MonthView({ events, onEvent, ...getters }: ScheduleView) {
  console.log(onEvent);
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = getters.getDaysInMonth(
    currentDate.getMonth(),
    currentDate.getFullYear()
  );

  const handlePrevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(newDate);
  };

  function handleAddEvent(selectedDay: number) {
    console.log(selectedDay);
  }

  function handleShowMoreEvents(dayEvents: IEvent[]) {
    console.log(dayEvents);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const startOffset = firstDayOfMonth.getDay();

  const prevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const lastDateOfPrevMonth = new Date(
    prevMonth.getFullYear(),
    prevMonth.getMonth() + 1,
    0
  ).getDate();

  console.log("daysInMonth", daysInMonth, events);

  return (
    <div>
      <div className="flex flex-col mb-4">
        <motion.h2
          key={currentDate.getMonth()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl my-5 tracking-tighter font-bold"
        >
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </motion.h2>
        <div className="flex gap-3">
          <Button onClick={handlePrevMonth}>
            <ArrowLeft />
            Prev
          </Button>

          <Button onClick={handleNextMonth}>
            Next
            <ArrowRight />
          </Button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={currentDate.getMonth()}
          className="grid grid-cols-7 gap-1 sm:gap-2"
        >
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className="text-left my-8 text-4xl tracking-tighter font-medium"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: startOffset }).map((_, idx) => (
            <div key={`offset-${idx}`} className="h-[150px] opacity-50">
              <div className={cn("font-semibold relative text-3xl mb-1")}>
                {lastDateOfPrevMonth - startOffset + idx + 1}
              </div>
            </div>
          ))}

          {daysInMonth.map((dayObj) => {
            const dayEvents = getters.getEventsForDay(
              dayObj.day,
              currentDate,
              events
            );

            return (
              <motion.div
                className="hover:z-50 border-none h-[150px] rounded group flex flex-col"
                key={dayObj.day}
                variants={itemVariants}
              >
                <Card
                  className="shadow-md relative flex p-4 border border-default-100 h-full"
                  onClick={() => handleAddEvent(dayObj.day)}
                >
                  <div
                    className={cn(
                      "font-semibold relative text-3xl mb-1",
                      dayEvents.length > 0
                        ? "text-primary-600"
                        : "text-muted-foreground",
                      new Date().getDate() === dayObj.day &&
                        new Date().getMonth() === currentDate.getMonth() &&
                        new Date().getFullYear() === currentDate.getFullYear()
                        ? "text-secondary-500"
                        : ""
                    )}
                  >
                    {dayObj.day}
                  </div>
                  <div className="flex-grow flex flex-col gap-2 w-full overflow-hidden">
                    <AnimatePresence mode="wait">
                      {dayEvents?.length > 0 && (
                        <EventStyled
                          event={{
                            ...dayEvents[0],
                            minmized: true,
                          }}
                        />
                      )}
                    </AnimatePresence>
                    {dayEvents.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowMoreEvents(dayEvents);
                        }}
                        className="hover:bg-default-200 absolute right-2 text-xs top-2 transition duration-300 bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
                      >
                        {`+${dayEvents.length - 1}`}
                      </button>
                    )}
                  </div>

                  {dayEvents.length === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white tracking-tighter text-lg font-semibold">
                        Add Event
                      </span>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WeeklyView({ events, onEvent, ...getters }: ScheduleView) {
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

  function handleAddEvent(event?: Partial<IEvent>) {
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
                      className={cn(
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

export { DailyView, MonthView, WeeklyView };
