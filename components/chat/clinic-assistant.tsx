"use client";

import { useChat } from "@ai-sdk/react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { ClinicThread } from "./clinic-thread";
import { clinicConfig } from "@/lib/config";

export function ClinicAssistant() {
  const chat = useChat();

  const runtime = useChatRuntime(chat);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-screen flex-col bg-slate-50 text-slate-900 font-sans">
        <header className="flex items-center p-4 border-b bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              +
            </div>
            <h1 className="text-xl font-semibold text-slate-800">{clinicConfig.assistantName}</h1>
          </div>
        </header>
        <main className="flex-grow overflow-hidden relative">
          <ClinicThread />
        </main>
      </div>
    </AssistantRuntimeProvider>
  );
}
