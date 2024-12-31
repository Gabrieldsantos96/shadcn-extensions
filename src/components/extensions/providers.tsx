"use client";

import { type PropsWithChildren } from "react";
import { DialogListener } from "./DialogPopup/DialogListener";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
        <main className="container flex flex-1 flex-col border-b mx-auto">
          <div className={cn("w-full  flex-1 flex flex-col mt-4 mb-4")}>
            {children}
            <DialogListener />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default Providers;
