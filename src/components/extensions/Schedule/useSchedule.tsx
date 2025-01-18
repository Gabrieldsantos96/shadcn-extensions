import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetters } from "./useGetters";
import { SchedulerState, useSchedulerState } from "./useScheduleState";
import DailyView from "./views/Daily";
import MonthView from "./views/Monthly";
import WeeklyView from "./views/Week";

export function useSchedule(initialState?: SchedulerState) {
  const { events } = useSchedulerState(initialState);
  const getters = useGetters();

  return {
    events,
    getters,
    ScheduleRoot: ({ className }: { className?: string }) => {
      return (
        <>
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
                onEvent={(e) => console.log(e)}
              />
            </TabsContent>
            <TabsContent value="week">
              <WeeklyView
                {...getters}
                events={events}
                onEvent={(e) => console.log(e)}
              />
            </TabsContent>
            <TabsContent value="monthly">
              <MonthView
                {...getters}
                events={events}
                onEvent={(e) => console.log(e)}
              />
            </TabsContent>
          </Tabs>
        </>
      );
    },
  };
}
