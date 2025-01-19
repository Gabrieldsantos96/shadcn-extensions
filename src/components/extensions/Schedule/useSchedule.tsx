import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetters } from "./useGetters";
import { useSchedulerState } from "./useScheduleState";
import {
  DailyView,
  MonthView,
  WeeklyView,
} from "@/components/extensions/Schedule/Views";
import { SchedulerState } from "./ISchedule";
import AddEventModal, { IAddEventModalRef } from "./EventModal";
import { useRef } from "react";

export function useSchedule(initialState?: SchedulerState) {
  const { events } = useSchedulerState(initialState);
  const getters = useGetters();
  const ref = useRef<IAddEventModalRef>(null);

  return {
    events,
    getters,
    ScheduleRoot: ({ className }: { className?: string }) => {
      return (
        <>
          <AddEventModal ref={ref} />
          <Tabs defaultValue="day" className={className}>
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="day">
              <DailyView
                {...getters}
                events={events}
                onEvent={(e: any) => ref.current?.toggleModal()}
              />
            </TabsContent>
            <TabsContent value="week">
              <WeeklyView
                {...getters}
                events={events}
                onEvent={(e: any) => ref.current?.toggleModal()}
              />
            </TabsContent>
            <TabsContent value="monthly">
              <MonthView
                {...getters}
                events={events}
                onEvent={(e: any) => ref.current?.toggleModal()}
              />
            </TabsContent>
          </Tabs>
        </>
      );
    },
  };
}
