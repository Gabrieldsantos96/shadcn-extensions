import { z } from "zod";
import { Getters } from "./useGetters";

export type IEvent = {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  minmized?: any;
};

export type ScheduleView = Getters &
  SchedulerState & {
    onEvent: (event?: Pick<IEvent, "endDate" | "startDate">) => void;
    className?: string;
  };

export type SchedulerState = {
  events: IEvent[];
};

export type SchedulerAction = {
  type: "ADD_EVENT" | "REMOVE_EVENT" | "UPDATE_EVENT" | "SET_EVENTS";
  payload: any;
};

export interface UseSchedulerReturn extends SchedulerState {
  addEvent: (event: IEvent) => void;
  removeEvent: (id: string) => void;
  updateEvent: (event: IEvent) => void;
  setEvents: (events: IEvent[]) => void;
}

export const variants = [
  "success",
  "primary",
  "default",
  "warning",
  "danger",
] as const;

export type Variant = (typeof variants)[number];

export const eventSchema = z.object({
  title: z.string().nonempty("Event name is required"),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  variant: z.enum(["primary", "danger", "success", "warning", "default"]),
  color: z.string().nonempty("Color selection is required"),
});

export type EventFormData = z.infer<typeof eventSchema>;
