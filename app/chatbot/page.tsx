"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg shadow-lg shadow-indigo-950/50">
              🤖
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-neutral-50">
                Groq Chatbot
              </h1>
              <p className="text-xs text-neutral-500">Llama 3.1 8B · via Groq API</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearChat}
            className="rounded-lg border border-neutral-800 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:border-neutral-700 hover:text-neutral-200"
          >
            Clear chat
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 mb-4 space-y-4 shadow-xl backdrop-blur-sm">
          {messages.length === 0 && !error && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-neutral-500">
              <span className="text-2xl">💬</span>
              <p className="text-sm">Start a conversation to begin chatting with the bot</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-md"
                    : "bg-neutral-800 text-neutral-100 rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-neutral-800 px-4 py-3">
                <div className="flex space-x-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-neutral-500 animate-bounce"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-neutral-500 animate-bounce delay-100"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-neutral-500 animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="rounded-xl border border-red-900/50 bg-red-950/50 px-4 py-2.5 text-red-300">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="flex items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-1.5 shadow-lg backdrop-blur-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M3.4 20.6l17.45-8.4a1 1 0 000-1.8L3.4 1.98a1 1 0 00-1.4 1.05L4.1 11 2 20.55a1 1 0 001.4 1.05z" />
            </svg>
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-3 text-center text-xs text-neutral-600">
          <p>Make sure GROQ_API_KEY is set in your .env.local file</p>
        </div>
      </div>
    </div>
  );
}
