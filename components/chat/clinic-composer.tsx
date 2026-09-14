import { ComposerPrimitive } from "@assistant-ui/react";
import { Mic, Send, Square } from "lucide-react";
import { useEffect, useState, useRef } from "react";


export function ClinicComposer() {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Custom hook usage for getting/setting composer text
  // Not strictly necessary if we use document.execCommand, but let's use standard approaches
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            // A bit hacky since assistant-ui manages its own state for the composer
            // We dispatch an input event to the textarea
            const textarea = document.querySelector('textarea[data-assistant-ui-composer-input]') as HTMLTextAreaElement;
            if (textarea) {
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
              if (nativeInputValueSetter) {
                nativeInputValueSetter.call(textarea, textarea.value + " " + finalTranscript);
                const ev2 = new Event('input', { bubbles: true});
                textarea.dispatchEvent(ev2);
              }
            }
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <ComposerPrimitive.Root className="relative flex w-full flex-col rounded-2xl border border-slate-300 bg-white shadow-lg transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
      <div className="flex items-end gap-2 p-3">
        <ComposerPrimitive.Input
          autoFocus
          placeholder="Ask about the clinic..."
          rows={1}
          data-assistant-ui-composer-input="true"
          className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        
        <div className="flex items-center gap-2 pr-2 pb-1">
          <button
            type="button"
            onClick={toggleListening}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
            title={isListening ? "Stop Dictation" : "Start Dictation"}
          >
            {isListening ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
          </button>
          
          <ComposerPrimitive.Send className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600">
            <Send size={18} />
          </ComposerPrimitive.Send>
        </div>
      </div>
    </ComposerPrimitive.Root>
  );
}
