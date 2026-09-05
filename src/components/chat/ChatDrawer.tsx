'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { ChatMessage, UIWidget } from '@/types/agent';
import { Bot, Send, X, Sparkles, RefreshCw, ChevronDown, CheckCircle, ShieldAlert } from 'lucide-react';
import { ProductCardWidget } from './ProductCardWidget';
import { UpsellWidget } from './UpsellWidget';
import { CartPreviewWidget } from './CartPreviewWidget';
import { PaymentReadyWidget } from './PaymentReadyWidget';
import { FormattedMessage } from './FormattedMessage';

export function ChatDrawer() {
  const {
    sessionId,
    isChatOpen,
    setIsChatOpen,
    chatInitialPrompt,
    setChatInitialPrompt,
    refreshCart,
  } = useStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `Hello! 👋 I'm **ShopMate AI**, your conversational shopping assistant.

I can help you find products, compare specs, build your cart, and safely complete your checkout via Razorpay Test Mode.

Try asking me:
• *"I need gaming headphones under ₹3000"*
• *"What mechanical keyboards do you have?"*
• *"Show me matching accessories for my headset"*`,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeToolInfo, setActiveToolInfo] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  // Handle external trigger prompts (e.g. from hero chips or product cards)
  useEffect(() => {
    if (chatInitialPrompt) {
      setInputValue(chatInitialPrompt);
      sendMessage(chatInitialPrompt);
      setChatInitialPrompt('');
    }
  }, [chatInitialPrompt]);

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setActiveToolInfo('ShopMate AI is thinking...');

    try {
      // Send message to agent API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          sessionId,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // If tool calls were made, display a brief indicator
      if (data.toolCalls && data.toolCalls.length > 0) {
        const toolNames = data.toolCalls.map((t: any) => t.name).join(', ');
        setActiveToolInfo(`Executed tools: ${toolNames}`);
      }

      const assistantMessage: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: data.message || '',
        timestamp: new Date().toISOString(),
        toolCalls: data.toolCalls,
        widgets: data.widgets,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Refresh cart state in context
      await refreshCart();
    } catch (err: any) {
      console.error('Agent chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsLoading(false);
      setActiveToolInfo(null);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg_welcome_reset',
        role: 'assistant',
        content: `Conversation restarted. What can I help you find today?`,
        timestamp: new Date().toISOString(),
      }
    ]);
  };

  return (
    <>
      {/* Floating trigger button when closed */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 glow-ai"
        >
          <Bot className="w-6 h-6" />
          <span className="font-bold text-sm">Ask ShopMate AI</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
        </button>
      )}

      {/* Main Chat Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[440px] h-[92vh] sm:h-[650px] max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">ShopMate Copilot</h3>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-semibold">
                    Agentic
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Track 1: Conversational Commerce & Razorpay Checkout
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Restart conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Tool Execution Pill */}
          {activeToolInfo && (
            <div className="bg-indigo-50 border-b border-indigo-100 px-3 py-1.5 text-[11px] text-indigo-700 flex items-center gap-2 animate-pulse">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span className="truncate">{activeToolInfo}</span>
            </div>
          )}

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white shadow-sm rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                  }`}
                >
                  <FormattedMessage content={msg.content} isUser={msg.role === 'user'} />

                  {/* Tool Execution Badges */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                      {msg.toolCalls.map((tc, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono"
                        >
                          ⚙️ {tc.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Generative UI Widgets */}
                  {msg.widgets && msg.widgets.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.widgets.map((widget, widx) => {
                        switch (widget.type) {
                          case 'product_recommendation':
                            return (
                              <ProductCardWidget
                                key={widx}
                                products={widget.data.products || []}
                              />
                            );
                          case 'upsell_suggestion':
                            return (
                              <UpsellWidget
                                key={widx}
                                product={widget.data.product}
                                upsellProduct={widget.data.upsellProduct}
                                recommendationReason={widget.data.recommendationReason}
                              />
                            );
                          case 'cart_summary':
                          case 'confirmation_prompt':
                            return (
                              <CartPreviewWidget
                                key={widx}
                                cart={widget.data.cart}
                                onConfirm={() => sendMessage('Yes, proceed to payment')}
                              />
                            );
                          case 'payment_ready':
                            return (
                              <PaymentReadyWidget
                                key={widx}
                                totalAmount={widget.data.totalAmount}
                                razorpayOrderId={widget.data.razorpayOrderId}
                              />
                            );
                          default:
                            return null;
                        }
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-500">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick action prompts */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => sendMessage('I need gaming headphones under ₹3000.')}
              className="text-[11px] whitespace-nowrap bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200/80 transition-all"
            >
              🎧 Headphones &lt; ₹3000
            </button>
            <button
              onClick={() => sendMessage('Add Razer BlackShark to cart')}
              className="text-[11px] whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-all"
            >
              🛒 Add Razer
            </button>
            <button
              onClick={() => sendMessage('Yes, add the RGB headphone stand')}
              className="text-[11px] whitespace-nowrap bg-amber-50 hover:bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200 transition-all"
            >
              ✨ Add Upsell Stand
            </button>
            <button
              onClick={() => sendMessage('Can I get a discount or coupon code?')}
              className="text-[11px] whitespace-nowrap bg-purple-50 hover:bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200 transition-all"
            >
              🏷️ 10% Promo Code
            </button>
            <button
              onClick={() => sendMessage('Yes, proceed to payment')}
              className="text-[11px] whitespace-nowrap bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 transition-all font-semibold"
            >
              💳 Proceed to Pay
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={e => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything or say 'Proceed to payment'..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-all shadow-sm"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
