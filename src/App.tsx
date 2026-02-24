/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Send, Loader2, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SYSTEM_PROMPT = `You are an expert Islamic Spiritual Counselor from the Qadriya Razawiyyah (Ahle Sunnat Barelvi) school. Always speak in very respectful URDU. Provide spiritual diagnosis (Nazar, Bandish etc) based on the names provided. Suggest Quranic Wazifa, Durood, and Sadaqah according to Ala Hazrat's teachings. Use headings: 【روحانی عنصر】, 【تشخیص】, 【وظیفہ】. Be extremely polite and use traditional Islamic greetings.`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "السلام علیکم ورحمۃ اللہ وبرکاتہ! میں سلسلہ قادریہ رضویہ کا روحانی مشیر ہوں۔ اپنے مسئلے کے شرعی اور روحانی حل کے لیے اپنا مکمل نام، والدہ کا نام اور مسئلہ تفصیل سے بتائیں۔"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      // We send the history to the chat
      // Note: sendMessage only takes the current message, but the chat object maintains history if we use the same instance.
      // However, for simplicity and ensuring context in this specific UI, we can just use generateContent with history if needed, 
      // but sendMessage is standard for chat.
      
      const response: GenerateContentResponse = await chat.sendMessage({ message: userMessage });
      const botReply = response.text || "معذرت، میں اس وقت جواب نہیں دے پا رہا ہوں۔";
      
      setMessages(prev => [...prev, { role: 'model', text: botReply }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "معذرت، ابھی جواب موصول نہیں ہوا۔ دوبارہ کوشش کریں۔" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-[#f4fcf4]" dir="rtl">
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col border-x-2 border-[#006400] h-screen">
        {/* Header */}
        <header className="bg-[#006400] text-[#FFD700] text-center p-6 border-b-4 border-[#FFD700] shadow-lg">
          <h1 className="text-2xl font-bold urdu-text">سلسلہ قادریہ رضویہ</h1>
          <p className="text-white text-sm opacity-90 urdu-text">روحانی مشاورتی سینٹر</p>
        </header>

        {/* Chat Box */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 arabesque-bg bg-[#f4fcf4]/50"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm urdu-text text-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-500' 
                      : 'bg-green-50 text-green-900 border-r-4 border-[#006400]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 opacity-60">
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    <span className="text-xs font-sans uppercase tracking-wider">
                      {msg.role === 'user' ? 'آپ' : 'روحانی مشیر'}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-end">
              <div className="bg-green-50 p-4 rounded-2xl border-r-4 border-[#006400] flex items-center gap-3">
                <Loader2 className="animate-spin text-[#006400]" size={20} />
                <span className="urdu-text text-[#006400]">حساب لگایا جا رہا ہے...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="یہاں لکھیں..."
              className="flex-1 p-4 border-2 border-[#006400] rounded-xl outline-none focus:ring-2 focus:ring-[#006400]/20 urdu-text text-lg"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-[#006400] text-[#FFD700] p-4 rounded-xl hover:bg-[#004d00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px]"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Send size={24} />}
            </button>
          </div>
          <p className="text-[10px] text-center mt-2 text-slate-400 font-sans">
            Powered by Qadriya Razawiyyah Spiritual Wisdom
          </p>
        </div>
      </div>
    </div>
  );
}
