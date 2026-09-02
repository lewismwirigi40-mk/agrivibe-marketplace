// src/components/AIChat.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  Minimize2,
  Maximize2,
  ChevronDown,
  Phone,
  Mail,
  Clock,
  Shield,
  Zap,
  Mic,
  Paperclip,
  Smile,
  ArrowUp,
  Loader2,
  CheckCircle,
  AlertCircle,
  History,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import api from "../services/api";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isAnswered?: boolean;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Welcome to AgriVibe AI!\n\nI'm here to help you with:\n• 🛒 Orders & deliveries\n• 💳 Payments & refunds\n• 🌾 Produce information\n• 📋 About AgriVibe\n• 🤝 Becoming a vendor\n\nWhat would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [hasUnanswered, setHasUnanswered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Save unanswered question - simplified and fixed
  const saveUnansweredQuestion = async (question: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("⚠️ User not logged in, question not saved");
        return;
      }

      // ✅ Only send the question field
      await api.post("/ai/unanswered", { question });
      setHasUnanswered(true);
      console.log("📝 Question saved for admin review");
    } catch (error: any) {
      // ✅ Better error handling
      if (error.response?.status === 401) {
        console.log("⚠️ User not authenticated, question not saved");
      } else if (error.response?.status === 400) {
        console.log("⚠️ Question already exists or invalid");
      } else {
        console.error("Failed to save question:", error);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.post("/ai/chat", { message: userInput });
      const aiResponse = response.data.message;

      // Check if AI couldn't answer
      const isUnanswered =
        aiResponse.includes("I'm still learning") ||
        aiResponse.includes("don't have an answer") ||
        aiResponse.includes("not have an answer");

      // ✅ Only save if unanswered AND user is logged in
      if (isUnanswered) {
        await saveUnansweredQuestion(userInput);
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        isAnswered: !isUnanswered,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI chat error:", error);
      const aiMessage: Message = {
        id: messages.length + 2,
        text: "⚠️ Sorry, I'm having trouble connecting. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => handleSend(), 100);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const quickSuggestions = [
    "Order status",
    "Delivery fee",
    "Payment methods",
    "Become a vendor",
    "Mango benefits",
    "Fresh produce",
  ];

  return (
    <>
      {/* ====== FLOATING CHAT BUTTON ====== */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-8 right-8 z-50 group ${
          isOpen ? "hidden" : "flex"
        }`}
      >
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-agrivibe-green to-emerald-500 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Button Body */}
          <div className="relative flex items-center gap-3 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-agrivibe-green/40 hover:shadow-agrivibe-green/60 transition-all duration-300">
            <div className="relative">
              <Bot className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white" />
            </div>
            <span className="font-bold text-sm hidden sm:inline">
              AgriVibe AI
            </span>
            <span className="font-bold text-sm sm:hidden">AI</span>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>
      </motion.button>

      {/* ====== CHAT WINDOW ====== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "auto",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed bottom-8 right-8 z-50 w-[400px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden ${
              isMinimized ? "h-auto" : "h-[560px]"
            }`}
          >
            {/* ====== HEADER ====== */}
            <div className="relative bg-gradient-to-r from-agrivibe-green to-emerald-500 p-4">
              <div className="absolute inset-0 bg-white/5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">
                      AgriVibe AI
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white/80 text-xs">
                        Online • Ready to help
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {hasUnanswered && (
                    <div className="relative mr-1">
                      <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
                      <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                    </div>
                  )}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={toggleChat}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ====== MESSAGES ====== */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[320px] bg-gray-50 dark:bg-gray-800/50">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.text}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p
                            className={`text-[10px] ${
                              msg.sender === "user"
                                ? "text-white/70"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {msg.sender === "ai" && msg.isAnswered && (
                            <span className="text-[10px] text-green-500 flex items-center gap-0.5">
                              <CheckCircle className="w-2.5 h-2.5" />
                              Answered
                            </span>
                          )}
                          {msg.sender === "ai" && msg.isAnswered === false && (
                            <span className="text-[10px] text-yellow-500 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 shadow-md p-3 rounded-2xl">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-agrivibe-green rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-agrivibe-green rounded-full animate-bounce delay-100" />
                          <span className="w-2 h-2 bg-agrivibe-green rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* ====== QUICK SUGGESTIONS ====== */}
                <div className="px-4 py-2 border-t border-gray-100 dark:border-white/5">
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    {quickSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleQuickSuggestion(suggestion)}
                        className="flex-shrink-0 px-3 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-white/10 transition-all duration-200 hover:scale-105"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ====== INPUT ====== */}
                <div className="p-3 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && !e.shiftKey && handleSend()
                        }
                        placeholder="Ask me anything..."
                        className="w-full px-4 py-2.5 pr-12 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-agrivibe-green focus:ring-4 focus:ring-agrivibe-green/10 outline-none transition-all resize-none"
                      />
                      <button
                        onClick={() => setInput(input + " 😊")}
                        className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="flex-shrink-0 w-11 h-11 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                    >
                      <ArrowUp className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Encrypted
                      </span>
                      <span>•</span>
                      <span>Powered by AgriVibe AI</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-gray-400">Online</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
