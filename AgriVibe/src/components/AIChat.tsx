import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '👋 Welcome to AgriVibe AI!\n\nI\'m here to help you with:\n• 🛒 Orders & deliveries\n• 💳 Payments & refunds\n• 🌾 Produce information\n• 📋 About AgriVibe\n• 🤝 Becoming a vendor\n\nWhat would you like to know?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveUnansweredQuestion = async (question: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await api.post('/ai/unanswered', { question });
      console.log('📝 Question saved for admin review');
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // ✅ ONLY use the backend API - NO LOCAL FALLBACK
      const response = await api.post('/ai/chat', { message: userInput });
      
    
      // Check if the response is an unanswered message
      if (response.data.message.includes("I'm still learning") || response.data.message.includes("I don't have an answer")) {
      await saveUnansweredQuestion(userInput);
      }
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: response.data.message,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      const aiMessage: Message = {
        id: messages.length + 2,
        text: '⚠️ Sorry, I\'m having trouble connecting. Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
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

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-600 to-emerald-500 text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2"
        aria-label="Chat with AgriVibe AI"
      >
        <span className="text-2xl">🤖</span>
        <span className="hidden md:inline font-medium">Ask AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <div>
                <h3 className="text-white font-semibold">AgriVibe AI</h3>
                <p className="text-gray-400 text-xs">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-gray-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-[10px] opacity-50 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-100">●</span>
                    <span className="animate-bounce delay-200">●</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {['Order status', 'Delivery fee', 'Payment methods', 'Become a vendor', 'Mango benefits'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="flex-shrink-0 bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-full border border-white/10 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-4 py-2 rounded-xl font-semibold transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}