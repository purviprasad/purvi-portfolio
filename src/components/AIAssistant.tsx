import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export const AIAssistant: React.FC = () => {
  const { isRetro } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: "Hi! This is a quick-answers panel. Try the chips below or type about stack, Apple, contact, or projects for preset info on Purvi’s background.",
    },
  ]);
  const [input, setInput] = useState("");

  const suggestions = [
    "What's her stack?",
    "Tell me about Apple experience",
    "How to contact her?",
    "View latest project"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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
      let response =
        "That's a great question! Purvi is a Senior Engineer focused on MERN full-stack delivery and applied AI—React, Node.js, LangChain, RAG, and LLM integrations alongside scalable backends.";

      const lowerMsg = msg.toLowerCase();
      if (lowerMsg.includes("skill") || lowerMsg.includes("stack")) {
        response =
          "Purvi's stack spans MERN (React, Redux, Node.js, Express, MongoDB) plus PostgreSQL and SQL. On the AI side she works with LangChain, RAG, LLMs, vector stores, and integrating model APIs into apps—alongside microservices and AWS/Azure where projects need them.";
      } else if (lowerMsg.includes("apple")) {
        response = "At Apple, Purvi was a Specialist Programmer L2. She notably optimized a Go-based data generation pipeline, reducing memory usage from 12GB to 6GB (80%+ gain).";
      } else if (lowerMsg.includes("contact") || lowerMsg.includes("email")) {
        response = "You can reach her at purvisehgal5@gmail.com or through the LinkedIn link in the header. She's currently open to exciting new roles!";
      } else if (lowerMsg.includes("project")) {
        response = "Her latest major projects include PSUI—a headless, themeable React component library—and PigB—an AI-powered financial dashboard built with Next.js and MongoDB. You can see them in the Projects section!";
      }

      setMessages((prev) => [...prev, { role: "ai", text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open quick answers about Purvi"
        className={`fixed bottom-[12.5rem] right-6 z-50 w-14 h-14 transition-all flex items-center justify-center group border ${isRetro
          ? "rounded-none border-2 border-[var(--brand)] bg-[var(--bg)] text-[var(--brand)] shadow-[0_0_15px_var(--brand)]"
          : "rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] border-[var(--border)]/20"
          }`}
      >
        <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:block absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--surface)] text-[var(--text)] px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border border-[var(--border)] shadow-xl pointer-events-none">
          Quick answers
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, scale: 0.9, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 50, filter: "blur(10px)" }}
            className={`fixed z-[60] inset-x-3 bottom-28 max-sm:max-h-[min(70dvh,520px)] sm:inset-x-auto sm:left-auto sm:right-6 sm:bottom-[12.5rem] md:right-28 w-auto sm:w-[min(420px,calc(100vw-3rem))] h-[min(70dvh,550px)] sm:h-[550px] bg-[var(--surface)]/95 border flex flex-col overflow-hidden backdrop-blur-2xl transition-all ${isRetro
              ? "rounded-none border-2 border-[var(--brand)] shadow-[0_0_30px_var(--brand)]"
              : "rounded-[2.5rem] border-[var(--border)] shadow-2xl ring-1 ring-[var(--border)]/50"
              }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)]/50 bg-gradient-to-r from-[var(--brand)]/10 to-transparent flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand)] flex items-center justify-center shadow-inner">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Quick answers</h3>
                  <p className="text-[10px] text-[var(--muted)] font-medium leading-tight">
                    FAQ bot · scripted replies, not a chat model
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors"
                aria-label="Close chat"
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
                  <div className={`w-6 h-6 flex items-center justify-center text-[10px] ${isRetro ? "rounded-none border border-[var(--brand)]" : "rounded-full"
                    } ${m.role === 'user' ? 'bg-[var(--muted)] text-white' : 'bg-[var(--brand)] text-white'}`}>
                    {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`max-w-[85%] p-4 text-sm leading-relaxed ${isRetro ? "rounded-none border border-[var(--brand)] bg-[var(--bg)]/10" : "rounded-3xl shadow-sm"
                    } ${m.role === "user"
                      ? (isRetro ? "border-r-4" : "bg-[var(--brand)] text-white rounded-br-none shadow-lg")
                      : (isRetro ? "border-l-4" : "bg-[var(--bg)] text-[var(--text)] rounded-bl-none border border-[var(--border)]")
                    }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full bg-[var(--brand)] flex items-center justify-center text-white`}>
                    <Bot size={12} />
                  </div>
                  <div className="bg-[var(--bg)] p-4 rounded-3xl rounded-bl-none border border-[var(--border)] flex gap-1 items-center">
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
                  type="button"
                  key={i}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[10px] font-semibold text-[var(--muted)] hover:bg-[var(--brand)] hover:text-white hover:border-[var(--brand)] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-[var(--border)]/50">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="e.g. stack, Apple, contact, projects…"
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-2xl pl-4 pr-12 py-3.5 text-sm outline-none focus:border-[var(--brand)]/50 focus:ring-1 focus:ring-[var(--brand)]/30 transition-all shadow-inner text-[var(--text)]"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="absolute right-2 p-2 rounded-xl bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-xl"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-3 text-center text-[9px] text-[var(--muted)] font-medium uppercase tracking-wider">
                Keyword hints → preset answers
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
