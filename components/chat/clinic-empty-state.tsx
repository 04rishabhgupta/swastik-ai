import { ThreadPrimitive } from "@assistant-ui/react";
import { clinicConfig } from "@/lib/config";
import { Activity } from "lucide-react";

export function ClinicEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-10 px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
        <Activity size={32} />
      </div>
      <h2 className="mb-2 text-2xl font-semibold text-slate-800">
        Welcome to {clinicConfig.name}
      </h2>
      <p className="mb-10 max-w-md text-slate-500">
        How can I help you today? Ask me about doctors, timings, location, or appointments.
      </p>

      <div className="w-full max-w-2xl">
        <p className="mb-4 text-sm font-medium text-slate-400">Suggested questions</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {clinicConfig.suggestedQuestions.map((question, i) => (
            <ThreadPrimitive.Suggestion
              key={i}
              prompt={question}
              method="replace"
              autoSend
              className="flex items-start rounded-xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>{question}</span>
            </ThreadPrimitive.Suggestion>
          ))}
        </div>
      </div>
    </div>
  );
}
