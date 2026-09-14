import { MessagePrimitive } from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import { Activity, User } from "lucide-react";
import { clsx } from "clsx";

export function ClinicMessage({ role }: { role: "user" | "assistant" }) {
  const isAssistant = role === "assistant";

  return (
    <MessagePrimitive.Root
      className={clsx(
        "flex w-full gap-4",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div
        className={clsx(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isAssistant ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
        )}
      >
        {isAssistant ? <Activity size={16} /> : <User size={16} />}
      </div>

      <div
        className={clsx(
          "flex max-w-[80%] flex-col gap-2 rounded-2xl px-5 py-3.5",
          isAssistant
            ? "bg-white border border-slate-100 shadow-sm text-slate-800"
            : "bg-slate-200 text-slate-800"
        )}
      >
        <MessagePrimitive.Content
          components={{
            // @ts-expect-error Types mismatched but runtime works
            Text: MarkdownTextPrimitive,
          }}
        />
      </div>
    </MessagePrimitive.Root>
  );
}
