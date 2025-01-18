"use client";

import React from "react";
import { TrashIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Event } from "./useScheduleState";
import { cn } from "@/lib/utils";

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

export default function EventStyled({ event }: { event: Event }) {
  function handleEditEvent(event: Event) {
    console.log(event);
    // Implementação da função de edição
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      key={event?.id}
      className="w-full relative cursor-pointer border border-gray-300 rounded-lg flex flex-col flex-grow"
    >
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          // handlers.handleDeleteEvent(event?.id);
        }}
        className="absolute z-50 right-0 top-[-5px] bg-red-500 text-white p-1 rounded-full cursor-pointer"
      >
        <TrashIcon size={12} />
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          handleEditEvent({
            id: event?.id,
            title: event?.title,
            startDate: event?.startDate,
            endDate: event?.endDate,
            description: event?.description,
          });
        }}
        className={cn(
          "min-w-full items-start flex-grow flex-col flex rounded-md",
          event?.minmized ? "h-full" : "min-h-fit p-2"
        )}
      >
        <div
          className={cn(
            "flex flex-col flex-grow px-1 rounded-md items-start w-full",
            event?.minmized ? "p-0" : "p-2"
          )}
        >
          <h1
            className={cn(
              "font-semibold line-clamp-1",
              event?.minmized && "text-[0.7rem] p-0 px-1"
            )}
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
