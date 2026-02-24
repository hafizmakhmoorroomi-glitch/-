import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, User, Bot, Calculator, HeartPulse, ShieldCheck } from 'lucide-react';

// ورسل کی سیٹنگز سے کی (Key) اٹھانے کا طریقہ
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function App() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'السلام علیکم ورحمۃ اللہ وبرکاتہ! میں سلسلہ عالیہ قادریہ رضویہ کا روحانی مشیر ہوں۔ اپنا نام، والدہ کا نام اور مسئلہ بیان فرمائیں۔' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // چیک کریں کہ کیا کی (Key) موجود ہے
    if (!API_KEY) {
      setMessages(prev => [...prev, { role: 'user', text: input }]);
      setMessages(prev => [...prev, { role: 'bot', text: 'سسٹم کی ترتیب میں غلطی ہے: API Key نہیں مل رہی۔ براہ کرم ورسل سیٹنگز چیک کریں۔' }]);
      return;
    }

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `آپ سلسلہ قادریہ رضویہ کے روحانی معالج ہیں۔ سائل کا مسئلہ: ${userMsg}۔ ابجد نکالیں، ستارہ بتائیں اور قرآنی علاج بتائیں۔`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'bot', text: text }]);
    } catch (error: any) {
      // یہاں ہم اصل ایرر دکھائیں گے تاکہ پتہ چلے بلاک ہے یا کچھ اور
      setMessages(prev => [...prev, { role: 'bot', text: `رابطہ کرنے میں دشواری: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f1] flex flex-col items-center p-2 sm:p-4" dir="rtl">
      <div className="w-full max-w-2xl bg-emerald-900 text-yellow-400 rounded-t-3xl p-6 text-center shadow-2xl">
        <ShieldCheck size={40} className="mx-auto mb-2" />
        <h1 className="text-3xl font-bold">سلسلہ قادریہ رضویہ</h1>
        <p className="text-sm text-white">روحانی تشخیص و مشاورتی سینٹر</p>
      </div>

      <div className="w-full max-w-2xl bg-white h-[60vh] overflow-y-auto p-4 border-x shadow-inner">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} mb-4`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-800'}`}>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && <div className="text-center italic animate-pulse">حساب جاری ہے...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="w-full max-w-2xl bg-white p-4 rounded-b-3xl shadow-xl border-t">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-emerald-100 focus:border-emerald-600 outline-none"
            rows={2}
            placeholder="نام اور مسئلہ لکھیں..."
          />
          <button onClick={handleSend} className="p-4 bg-emerald-800 text-white rounded-xl">
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;