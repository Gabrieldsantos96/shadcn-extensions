import { useReducer } from "react";
import { Getters } from "./useGetters";

export type Event = {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  minmized?: any;
};

export type ScheduleView = Getters &
  SchedulerState & {
    onEvent: (event?: Pick<Event, "endDate" | "startDate">) => void;
  };

export type SchedulerState = {
  events: Event[];
};

export type SchedulerAction = {
  type: "ADD_EVENT" | "REMOVE_EVENT" | "UPDATE_EVENT" | "SET_EVENTS";
  payload: any;
};

export interface UseSchedulerReturn extends SchedulerState {
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  updateEvent: (event: Event) => void;
  setEvents: (events: Event[]) => void;
}

export const initialSchedulerState: SchedulerState = {
  events: [],
};

export function schedulerReducer(
  state: SchedulerState,
  action: SchedulerAction
): SchedulerState {
  switch (action.type) {
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload] };

    case "REMOVE_EVENT":
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload.id),
      };

    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((event) =>
          event?.id === action.payload.id ? action.payload : event
        ),
      };

    case "SET_EVENTS":
      return { ...state, events: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function useSchedulerState(
  initialState: SchedulerState = initialSchedulerState
): UseSchedulerReturn {
  const [state, dispatch] = useReducer(schedulerReducer, {
    ...initialSchedulerState,
    ...initialState,
  });

  const addEvent = (event: Event) => {
    dispatch({ type: "ADD_EVENT", payload: event });
  };

  const removeEvent = (id: string) => {
    dispatch({ type: "REMOVE_EVENT", payload: { id } });
  };

  const updateEvent = (event: Event) => {
    dispatch({ type: "UPDATE_EVENT", payload: event });
  };

  const setEvents = (events: Event[]) => {
    dispatch({ type: "SET_EVENTS", payload: events });
  };

  return {
    ...state,
    addEvent,
    removeEvent,
    updateEvent,
    setEvents,
  };
}
