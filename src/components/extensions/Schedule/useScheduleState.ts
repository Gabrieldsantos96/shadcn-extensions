import { useReducer } from "react";
import {
  IEvent,
  SchedulerAction,
  SchedulerState,
  UseSchedulerReturn,
} from "./ISchedule";

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

  const addEvent = (event: IEvent) => {
    dispatch({ type: "ADD_EVENT", payload: event });
  };

  const removeEvent = (id: string) => {
    dispatch({ type: "REMOVE_EVENT", payload: { id } });
  };

  const updateEvent = (event: IEvent) => {
    dispatch({ type: "UPDATE_EVENT", payload: event });
  };

  const setEvents = (events: IEvent[]) => {
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
