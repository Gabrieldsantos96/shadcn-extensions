import { SchedulerState } from "@/components/extensions/Schedule/ISchedule";
import { useSchedule } from "@/components/extensions/Schedule/useSchedule";

export function SchedulePage() {
  const initialState: SchedulerState = {
    events: [
      {
        id: "1",
        title: "Team Meeting",
        description: "Discuss project updates",
        startDate: new Date("2024-07-25T10:00:00"),
        endDate: new Date("2024-07-25T11:00:00"),
        minmized: false,
      },

      {
        id: "2",
        title: "Code Review",
        description: "Review the new feature implementation",
        startDate: new Date("2024-07-26T14:00:00"),
        endDate: new Date("2024-07-26T15:30:00"),
        minmized: false,
      },
      {
        id: "3",
        title: "Client Call",
        description: "Discuss project requirements with client",
        startDate: new Date("2024-07-27T09:00:00"),
        endDate: new Date("2024-07-27T10:00:00"),
        minmized: true,
      },
      {
        id: "4",
        title: "Team Meeting 2.0",
        description: "Discuss project updates 2.0",
        startDate: new Date("2024-07-25T13:00:00"),
        endDate: new Date("2024-07-25T17:00:00"),
        minmized: false,
      },
    ],
  };
  console.log("init", initialState);

  const { ScheduleRoot } = useSchedule(initialState);
  return (
    <div>
      <ScheduleRoot />
    </div>
  );
}
