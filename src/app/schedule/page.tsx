import DailyView from "./view/daily";

const TITLE = "TanStack Table";

export function generateMetadata() {
  return {
    title: TITLE,
  };
}

export default async function TanstackPage() {
  return <DailyView />;
}

export const dynamic = "force-dynamic";
