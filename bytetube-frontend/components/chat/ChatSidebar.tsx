"use client";
import { useState, useEffect, useRef } from "react";
import { Send, User, MessageSquare, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";

interface Message {
  user: string;
  text: string;
  timestamp: string;
}

export default function ChatSidebar({ roomId, className }: { roomId: string, className?: string }) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  
  // Define WebSocket URL with fallback
  const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';

  // Animation variants
  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  useEffect(() => {
    const ws = new WebSocket(`${wsBaseUrl}/${roomId}`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // Debounce duplicate spammy messages
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        const isSpam =
          last &&
          last.user === msg.user &&
          last.text === msg.text &&
          Date.now() - new Date(last.timestamp).getTime() < 3000;

        return isSpam ? prev : [...prev, msg];
      });
    };

    ws.onopen = () => messageInputRef.current?.focus();
    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [roomId, wsBaseUrl]);

  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      const container = containerRef.current;
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      if (isNearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = (msg: Message) => {
    socket?.send(JSON.stringify(msg));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && username.trim()) {
      sendMessage({
        user: username,
        text: message,
        timestamp: new Date().toISOString()
      });
      setMessage("");
      setIsComposing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const getConnectionStatus = () => {
    if (socket?.readyState === WebSocket.OPEN) {
      return { text: "Connected", color: "bg-green-500" };
    } else if (socket?.readyState === WebSocket.CONNECTING) {
      return { text: "Connecting...", color: "bg-yellow-500" };
    } else {
      return { text: "Disconnected", color: "bg-red-500" };
    }
  };

  const status = getConnectionStatus();

  return (
    <motion.div 
      className={`flex flex-col h-full bg-zinc-900 border-l border-zinc-800 w-96 relative shadow-xl ${className || ''}`}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={sidebarVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Chat Container */}
      <div className="flex flex-col h-full bg-zinc-900/95 backdrop-blur-xl relative overflow-hidden">
        {/* Decorative background patterns */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,0,255,0.4),transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(120,0,255,0.4),transparent_40%)]"></div>
        </div>

        {/* Header */}
        <motion.div
          className="p-4 border-b border-zinc-800/80 sticky top-0 bg-zinc-900/90 backdrop-blur-lg z-10 flex items-center justify-between"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 rounded-full p-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Live Chat</h2>
              <p className="text-xs text-zinc-400">{messages.length} messages</p>
            </div>
          </div>
          
          <motion.div 
            className="flex items-center gap-2 bg-zinc-800/60 px-3 py-1.5 rounded-full shadow-inner"
            variants={pulseVariants}
            animate={status.text === "Connected" ? "pulse" : undefined}
          >
            <div className={`w-2 h-2 rounded-full ${status.color}`} />
            <span className="text-xs font-medium text-zinc-300">{status.text}</span>
          </motion.div>
        </motion.div>

        {/* Messages Container */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        >
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div 
                className="h-full flex flex-col items-center justify-center p-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
                  <Sparkles className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                <p className="text-sm text-zinc-400 max-w-xs">
                  Be the first one to start the conversation in this room!
                </p>
              </motion.div>
            ) : (
              <div className="p-4 space-y-4 min-h-full">
                <div className="flex items-center gap-2 mb-6 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-purple-200">Chat started at {new Date(messages[0].timestamp).toLocaleTimeString()}</span>
                </div>
                
                {messages.map((msg, index) => (
                  <motion.div
                    key={`${msg.timestamp}-${index}`}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2, delay: index === messages.length - 1 ? 0.05 : 0 }}
                  >
                    <ChatMessage
                      user={msg.user}
                      text={msg.text}
                      timestamp={new Date(msg.timestamp)}
                      isCurrentUser={msg.user === username}
                    />
                  </motion.div>
                ))}
                <div ref={messagesEndRef} className="h-px" />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <motion.div 
          className="p-4 border-t border-zinc-800/50 bg-zinc-900/90 backdrop-blur-lg sticky bottom-0 z-10"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                className="w-full bg-zinc-800/70 rounded-lg py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-zinc-800/90 shadow-inner transition-all"
                required
              />
            </div>
            
            <div className="flex gap-2 relative">
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setIsComposing(e.target.value.length > 0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full bg-zinc-800/70 rounded-lg py-3 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 
                    focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-zinc-800/90 shadow-inner transition-all"
                  required
                  ref={messageInputRef}
                />
                
                {isComposing && (
                  <motion.div 
                    className="absolute top-0 right-0 h-full flex items-center pr-2 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <span className="flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </motion.div>
                )}
              </div>
              
              <motion.button
                type="submit"
                className="bg-gradient-to-tr from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 active:from-purple-800 active:to-purple-600
                  text-white rounded-lg p-3 transition-all aspect-square flex items-center justify-center shadow-lg disabled:opacity-50 disabled:pointer-events-none
                  border border-purple-500/20"
                disabled={!username.trim() || !message.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}