import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, User } from "lucide-react";

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I'm Purvi's digital twin. I can tell you about her work at Apple, her MERN stack expertise, or how she reduced memory usage by 80%. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");

  const suggestions = [
    "What's her stack?",
    "Tell me about Apple experience",
    "How to contact her?",
    "View latest project"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textOverride?: string) => {
    const msg = textOverride || input.trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking
    setTimeout(() => {
      let response = "That's a great question! Purvi is a Senior Full-Stack Engineer specializing in React, Node.js, and scaling high-performance systems.";
      
      const lowerMsg = msg.toLowerCase();
      if (lowerMsg.includes("skill") || lowerMsg.includes("stack")) {
        response = "Purvi's core stack includes React, Redux, Node.js, PostgreSQL, and Go. She's also an expert in designing Microservices and cloud infrastructure on AWS/Azure.";
      } else if (lowerMsg.includes("apple")) {
        response = "At Apple, Purvi was a Specialist Programmer L2. She notably optimized a Go-based data generation pipeline, reducing memory usage from 12GB to 6GB (80%+ gain).";
      } else if (lowerMsg.includes("contact") || lowerMsg.includes("email")) {
        response = "You can reach her at purvisehgal5@gmail.com or through the LinkedIn link in the header. She's currently open to exciting new roles!";
      } else if (lowerMsg.includes("project")) {
        response = "Her latest major project is PigB—an AI-powered financial dashboard built with Next.js and MongoDB. You can see it in the Projects section!";
      }

      setMessages((prev) => [...prev, { role: "ai", text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center group border border-white/20"
      >
        <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--surface)] text-[var(--text)] px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border border-[var(--border)] shadow-xl pointer-events-none">
          Ask Purvi AI
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 50, filter: "blur(10px)" }}
            className="fixed bottom-24 right-28 z-[60] w-[90vw] sm:w-[420px] h-[550px] bg-[var(--surface)]/70 border border-white/20 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl ring-1 ring-white/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[var(--brand)]/10 to-transparent flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand)] flex items-center justify-center shadow-inner">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Purvi AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-[var(--muted)] font-medium uppercase tracking-tighter">Digital Twin Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${m.role === 'user' ? 'bg-zinc-800' : 'bg-[var(--brand)]'}`}>
                    {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                    m.role === "user" 
                      ? "bg-[var(--brand)] text-white rounded-br-none shadow-lg" 
                      : "bg-white/5 dark:bg-zinc-900/50 text-[var(--text)] rounded-bl-none border border-white/10 shadow-sm"
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-[var(--brand)] flex items-center justify-center">
                    <Bot size={12} />
                  </div>
                  <div className="bg-white/5 dark:bg-zinc-900/50 p-4 rounded-3xl rounded-bl-none border border-white/10 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-[var(--brand)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[var(--brand)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[var(--brand)] rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions Chips */}
            <div className="px-6 pb-2 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-[var(--muted)] hover:bg-[var(--brand)] hover:text-white hover:border-[var(--brand)] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me about Purvi..."
                  className="w-full bg-white/5 dark:bg-zinc-900/50 border border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-sm outline-none focus:border-[var(--brand)]/50 focus:ring-1 focus:ring-[var(--brand)]/30 transition-all shadow-inner"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="absolute right-2 p-2 rounded-xl bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-xl"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <Sparkles size={10} className="text-[var(--brand)]" />
                <span className="text-[9px] text-[var(--muted)] font-bold uppercase tracking-widest">Driven by Advanced RAG Logic</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
