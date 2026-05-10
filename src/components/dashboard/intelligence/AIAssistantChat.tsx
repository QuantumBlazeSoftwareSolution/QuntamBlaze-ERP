"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
}

const MOCK_CHAT: ChatMessage[] = [
  { id: "msg-1", sender: "ai", text: "Hello Commander. I am Quantum AI. I have analyzed the recent Q2 projections. Would you like a breakdown of the anomalies detected in the CRM pipeline?" },
];

export function AIAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = { id: Date.now().toString(), sender: "user", text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Mock AI response delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Based on current trajectories, I recommend re-allocating 15% of compute bandwidth from Engineering to Data Science to mitigate the upcoming data processing bottleneck predicted for next week."
      }]);
    }, 2000);
  };

  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-divider bg-page-bg flex items-center justify-between shrink-0">
        <h3 className="text-text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          Quantum AI Assistant
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Online
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3 max-w-[85%]", msg.sender === "user" ? "ml-auto flex-row-reverse" : "")}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                msg.sender === "ai" 
                  ? "bg-accent/10 text-accent border-accent/20" 
                  : "bg-sidebar-bg text-white border-border"
              )}>
                {msg.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-3 rounded-xl text-sm leading-relaxed shadow-sm",
                msg.sender === "ai" 
                  ? "bg-page-bg border border-divider text-text-primary rounded-tl-sm" 
                  : "bg-accent text-white rounded-tr-sm"
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 max-w-[85%]"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent border border-accent/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-xl bg-page-bg border border-divider rounded-tl-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-4 border-t border-divider bg-white shrink-0">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Quantum AI for insights..."
            className="w-full bg-page-bg border border-divider rounded-lg h-11 pl-4 pr-12 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-1.5 top-1.5 bottom-1.5 w-8 flex items-center justify-center rounded-md bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
