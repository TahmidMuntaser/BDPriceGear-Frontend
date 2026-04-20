'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, Copy, Check } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BUILD_SECTION_LABELS = ['CPU', 'Motherboard', 'RAM', 'Storage', 'GPU', 'PSU', 'Case'];

const toDisplayRows = (text) => {
  if (!text) return [];
  return text.replace(/\r/g, '').split('\n');
};

const renderLinkedText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    const isUrl = /^https?:\/\//.test(part);

    if (isUrl) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-300 underline decoration-emerald-500/60 hover:text-emerald-200"
        >
          {part}
        </a>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
};

const extractBotResponseText = (data) => {
  if (!data) return '';

  if (typeof data === 'string') {
    return data;
  }

  const candidates = [
    data.reply,
    data.response,
    data.answer,
    data.text,
    data.message,
    data.content,
  ]
    .filter((value) => typeof value === 'string' && value.trim().length > 0)
    .sort((a, b) => b.length - a.length);

  return candidates[0] || '';
};

const formatBotMessage = (text) => {
  const rows = toDisplayRows(text);

  if (!rows.length) return null;

  return (
    <div className="space-y-1.5">
      {rows.map((row, index) => {
        const trimmedLine = row.trim();

        if (!trimmedLine) {
          return <div key={`gap-${index}`} className="h-1.5" />;
        }

        const isHeading = /^Build Recommendation:?/i.test(trimmedLine);
        const sectionMatch = trimmedLine.match(/^(CPU|Motherboard|RAM|Storage|GPU|PSU|Case|Total|Why this build):(.*)$/i);
        const detailMatch = trimmedLine.match(/^(Price|Shop|Link):(.*)$/i);

        if (isHeading) {
          return (
            <div key={`line-${index}`} className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300">
              {trimmedLine.replace(/:$/, '')}
              </p>
            </div>
          );
        }

        if (sectionMatch) {
          const label = BUILD_SECTION_LABELS.find((item) => item.toLowerCase() === sectionMatch[1].toLowerCase()) || sectionMatch[1];
          const value = sectionMatch[2]?.trim();

          return (
            <p key={`line-${index}`} className="text-[13px] leading-relaxed text-gray-100 rounded-md px-1 py-0.5">
              <span className="font-semibold text-emerald-300">{label}:</span>{' '}
              {renderLinkedText(value)}
            </p>
          );
        }

        if (detailMatch) {
          const label = detailMatch[1];
          const value = detailMatch[2]?.trim();

          return (
            <p key={`line-${index}`} className="pl-4 text-[12px] leading-relaxed text-gray-200">
              <span className="font-medium text-emerald-200">{label}:</span>{' '}
              {renderLinkedText(value)}
            </p>
          );
        }

        return (
          <p key={`line-${index}`} className="text-[13px] leading-relaxed text-gray-100">
            {renderLinkedText(trimmedLine)}
          </p>
        );
      })}
    </div>
  );
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi, I am your shopping assistant. Ask me anything about products, prices, or deals.',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      return;
    }

    const closeTimer = setTimeout(() => setIsRendered(false), 220);
    return () => clearTimeout(closeTimer);
  }, [isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const conversationHistory = [...messages, userMessage]
      .slice(-12)
      .map((message) => ({
        role: message.sender === 'user' ? 'user' : 'assistant',
        content: message.text,
      }));

    try {
      // Call chatbot API
      const chatbotEndpoint = `${API_BASE_URL}/chatbot/`;
      
      if (!API_BASE_URL) {
        throw new Error('API_BASE_URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in .env.local');
      }

      console.log('Sending message to:', chatbotEndpoint);
      console.log('Request payload:', { message: inputValue });

      const response = await axios.post(chatbotEndpoint, {
        message: inputValue,
        history: conversationHistory,
        messages: conversationHistory,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', response.data);

      // Add bot response
      const botResponseText = extractBotResponseText(response.data) || 'Sorry, I could not process your request.';
      const botMessage = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot API Error:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Status Code:', error.response.status);
        console.error('Response Data:', error.response.data);
        console.error('Request URL:', error.config?.url);
      } else if (error.request) {
        console.error('No response received. Backend might be down.');
        console.error('Attempted URL:', error.config?.url);
      }
      
      // Determine error message based on error type
      let errorText = 'Sorry, something went wrong. Please try again.';
      
      if (error.response?.status === 404) {
        errorText = 'Chatbot endpoint not found. Check if /chatbot/ exists on backend.';
      } else if (error.response?.status === 500) {
        errorText = 'Backend server error. Check server logs.';
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        errorText = 'Cannot connect to backend. Is it running on ' + API_BASE_URL + ' ?';
      }
      
      // Add error message from bot
      const errorMessage = {
        id: messages.length + 2,
        text: errorText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      toast.error(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCopyMessage = async (messageId, messageText) => {
    if (!messageText) return;

    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedMessageId(messageId);
      toast.success('Response copied');
      setTimeout(() => setCopiedMessageId(null), 1400);
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Unable to copy response');
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-[90] flex items-center justify-center w-14 h-14 rounded-full text-white shadow-[0_16px_38px_rgba(0,0,0,0.45)] transition-all duration-300 transform hover:scale-105 active:scale-95 bg-[radial-gradient(circle_at_22%_18%,#34d399_0%,#059669_40%,#065f46_100%)] border border-emerald-300/25 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open chatbot"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isRendered && (
        <div
          className={`fixed z-[95] bottom-4 left-8 right-8 w-[calc(100vw-4rem)] max-w-[calc(100vw-4rem)] h-[84vh] sm:inset-x-auto sm:bottom-2 sm:right-5 sm:h-[580px] sm:w-[390px] max-h-[640px] overflow-hidden rounded-[26px] border border-emerald-400/20 bg-gray-900/97 backdrop-blur-xl shadow-[0_36px_95px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-200 origin-bottom-right ${
            isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3 pointer-events-none'
          }`}
        >
          {/* Header */}
          <div className="relative px-4 py-3.5 text-white border-b border-emerald-500/20 bg-[linear-gradient(135deg,#111827_0%,#0b1620_52%,#082f24_100%)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
              {/* Bot Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-950 border border-emerald-400/35 shadow-[0_8px_20px_rgba(16,185,129,0.2)]">
                  <Bot size={20} className="text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[15px] tracking-tight text-emerald-100 truncate">BDPriceGear Assistant</h3>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Online now
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-emerald-500/10 transition-colors"
                aria-label="Close chatbot"
              >
                <X size={18} className="text-gray-300" />
              </button>
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-100">
              <Sparkles size={12} className="text-emerald-300" />
              Smart price and product guidance
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 space-y-3 bg-[radial-gradient(120%_100%_at_50%_0%,#111827_0%,#0b1320_42%,#0a0f1c_100%)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`flex items-end gap-2 max-w-[84%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.sender === 'bot' ? (
                    <span className="mb-1.5 h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0">
                      <Bot size={13} />
                    </span>
                  ) : (
                    <span className="mb-1.5 h-6 w-6 rounded-full bg-emerald-500 text-emerald-950 text-[10px] font-semibold flex items-center justify-center shrink-0">
                      You
                    </span>
                  )}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm border ${
                      message.sender === 'user'
                        ? 'bg-[linear-gradient(135deg,#10b981_0%,#059669_42%,#047857_100%)] text-white border-emerald-300/20 rounded-br-md'
                        : 'bg-gray-800/95 text-gray-100 border-gray-700 rounded-bl-md'
                    }`}
                  >
                    {message.sender === 'bot' ? formatBotMessage(message.text) : (
                      <span className="whitespace-pre-wrap break-words">{message.text}</span>
                    )}
                    {message.sender === 'bot' && (
                      <div className="mt-2 pt-2 border-t border-emerald-400/15 flex justify-end">
                        <button
                          onClick={() => handleCopyMessage(message.id, message.text)}
                          className="h-7 px-2.5 rounded-md border border-emerald-400/25 bg-gray-900/70 text-emerald-300 hover:bg-emerald-500/15 hover:text-emerald-200 transition-colors inline-flex items-center gap-1.5 text-[11px]"
                          aria-label="Copy response"
                          title="Copy response"
                        >
                          {copiedMessageId === message.id ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedMessageId === message.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2 max-w-[84%]">
                  <span className="mb-1.5 h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0">
                    <Bot size={13} />
                  </span>
                  <div className="bg-gray-800/95 px-3.5 py-2.5 rounded-2xl rounded-bl-md border border-gray-700 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:240ms]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-emerald-500/20 p-3 sm:p-4 bg-gray-900/98">
            <div className="flex items-center gap-2 rounded-2xl border border-gray-700 bg-gray-800/80 px-2 py-2 focus-within:border-emerald-400/60 focus-within:bg-gray-800 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about products, deals, or comparisons"
                disabled={isLoading}
                className="flex-1 bg-transparent px-2 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 outline-none disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-10 w-10 rounded-xl bg-[linear-gradient(135deg,#34d399_0%,#10b981_45%,#047857_100%)] hover:brightness-110 disabled:brightness-95 disabled:opacity-50 text-white transition-all flex items-center justify-center shadow-[0_8px_18px_rgba(16,185,129,0.35)]"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="mt-2 px-1 text-[11px] text-gray-500">Press Enter to send</p>
          </div>
        </div>
      )}
    </>
  );
}
