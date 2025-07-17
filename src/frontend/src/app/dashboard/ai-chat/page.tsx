"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  updatedAt: Date;
}

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load initial data
  useEffect(() => {
    // Simulate API call to get chats
    const fetchChats = async () => {
      // In a real app, you would fetch this from your API
      const mockChats: Chat[] = [
        {
          id: "1",
          title: "Project Planning",
          updatedAt: new Date(2025, 6, 15),
        },
        {
          id: "2",
          title: "Marketing Strategy",
          updatedAt: new Date(2025, 6, 14),
        },
        {
          id: "3",
          title: "Product Features",
          updatedAt: new Date(2025, 6, 12),
        },
      ];
      
      setChats(mockChats);
      
      // Set the first chat as current
      if (mockChats.length > 0) {
        setCurrentChat(mockChats[0].id);
        
        // Load messages for the first chat
        const mockMessages: Message[] = [
          {
            id: "1",
            sender: "ai",
            content: "Hello! How can I help you with your project planning today?",
            timestamp: new Date(2025, 6, 15, 9, 0),
          },
          {
            id: "2",
            sender: "user",
            content: "I need to create a timeline for our new product launch.",
            timestamp: new Date(2025, 6, 15, 9, 1),
          },
          {
            id: "3",
            sender: "ai",
            content: "I'd be happy to help you create a timeline for your product launch. To get started, could you tell me a bit more about the product and when you're aiming to launch it?",
            timestamp: new Date(2025, 6, 15, 9, 2),
          },
        ];
        
        setMessages(mockMessages);
      }
    };
    
    fetchChats();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !currentChat) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    try {
      // For now, let's create a simple working AI response
      // TODO: Connect to backend once we have proper auth setup
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const aiResponses = [
        `I understand you said "${message}". That's a great point to explore further!`,
        "Based on your message, I can help you break this down into actionable steps.",
        "Interesting! Let me think about that and provide some insights...",
        "I can definitely help you with that. Here are some approaches to consider:",
        "That's a valuable question. Let me analyze this from different angles...",
        "Great idea! I can see several ways we could develop this further."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: randomResponse + " Feel free to ask me anything about your projects, tasks, or ideas!",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: "I'm working on connecting to the full AI service. For now, I can still chat with you! What would you like to discuss about your projects?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
    
    setIsLoading(false);
  };

  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="pb-5 border-b border-gray-200 dark:border-gray-700 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          AI Chat
        </h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={() => {
              // In a real app, this would create a new chat
              const newChat: Chat = {
                id: (chats.length + 1).toString(),
                title: "New Chat",
                updatedAt: new Date(),
              };
              
              setChats([newChat, ...chats]);
              setCurrentChat(newChat.id);
              setMessages([
                {
                  id: "1",
                  sender: "ai",
                  content: "Hello! How can I help you today?",
                  timestamp: new Date(),
                },
              ]);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Chat
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat list sidebar */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Chats
            </h2>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    currentChat === chat.id
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }`}
                  onClick={() => setCurrentChat(chat.id)}
                >
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chat.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {chat.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3/4 rounded-lg px-4 py-2 ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === "user"
                        ? "text-indigo-200"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-3/4 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              AI has access to your project data and can help with planning, organization, and creative tasks.
            </div>
          </div>
        </div>

        {/* AI settings sidebar (hidden by default) */}
        {/* This would be expanded in a real implementation */}
      </div>
    </div>
  );
}