import { useSchedule } from "@/components/extensions/Schedule/useSchedule";

export function SchedulePage() {
  const { ScheduleRoot } = useSchedule();
  return (
    <div>
      <ScheduleRoot />
    </div>
  );
}
