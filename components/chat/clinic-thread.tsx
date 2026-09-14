"use client";

import { ThreadPrimitive } from "@assistant-ui/react";
import { ClinicMessage } from "./clinic-message";
import { ClinicComposer } from "./clinic-composer";
import { ClinicEmptyState } from "./clinic-empty-state";

export function ClinicThread() {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col bg-slate-50">
      <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
        <ThreadPrimitive.Empty>
          <ClinicEmptyState />
        </ThreadPrimitive.Empty>
        
        <div className="mx-auto flex max-w-3xl flex-col gap-8 pb-32">
          <ThreadPrimitive.Messages
            components={{
              UserMessage: () => <ClinicMessage role="user" />,
              EditComposer: () => null, // Simplified for now
              AssistantMessage: () => <ClinicMessage role="assistant" />,
            }}
          />
        </div>
      </ThreadPrimitive.Viewport>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pb-6 pt-10 px-4">
        <div className="mx-auto max-w-3xl">
          <ClinicComposer />
        </div>
      </div>
    </ThreadPrimitive.Root>
  );
}
