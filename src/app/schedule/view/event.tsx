"use client";

import React from "react";
import { TrashIcon } from "lucide-react";
import { motion } from "framer-motion";

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

const formatDate = (date: Date) => {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

interface EventStyledProps extends Event {
  minmized?: boolean;
  CustomEventComponent?: React.FC<Event>;
}

export default function EventStyled({ event }: { event: EventStyledProps }) {
  function handleEditEvent(event: Event) {
    console.log(event);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      key={event?.id}
      className="w-full relative use-automation-zoom-in cursor-pointer border border-default-400/60 rounded-lg  flex flex-col flex-grow "
    >
      <div
        onClickCapture={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          console.log("e", e);
        }}
      >
        <TrashIcon size={12} />
      </div>

      <div
        onClickCapture={(e) => {
          e.stopPropagation();
          handleEditEvent({
            id: event?.id,
            title: event?.title,
            startDate: event?.startDate,
            endDate: event?.endDate,
            description: event?.description,
          });
        }}
      >
        <div
          className={`flex ${
            event?.minmized ? "p-0" : "p-1"
          } flex-col flex-grow px-1 rounded-md  items-start w-full`}
        >
          <h1
            className={`${
              event?.minmized && "text-[0.7rem] p-0 px-1"
            } font-semibold line-clamp-1`}
          >
            {event?.title}
          </h1>

          <p className="text-[0.65rem]">{event?.description}</p>
          {!event?.minmized && (
            <div className="flex justify-between w-full">
              <p className="text-sm">{formatDate(event?.startDate)}</p>
              <p className="text-sm">-</p>
              <p className="text-sm">{formatDate(event?.endDate)}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
