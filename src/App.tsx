import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, User, Bot, Sparkles, Calculator, HeartPulse, ShieldCheck } from 'lucide-react';

// آپ کی فراہم کردہ نئی API Key
const API_KEY = "AIzaSyBKF5TefUj0SPNCnHQV0dtRBfrN509jyhw";

function App() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'السلام علیکم ورحمۃ اللہ وبرکاتہ! \nمیں سلسلہ عالیہ قادریہ رضویہ کا روحانی مشیر ہوں۔ اپنا نام، والدہ کا نام اور اپنا مسئلہ بیان فرمائیں۔ ان شاء اللہ علمِ اعداد کی روشنی میں آپ کی تشخیص کی جائے گی۔' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
      });

      // روحانی مشیر کے لیے مخصوص ہدایات
      const prompt = `آپ سلسلہ قادریہ رضویہ کے ایک جلیل القدر روحانی معالج اور ماہرِ علم الاعداد ہیں۔
      سائل کا پیغام: "${userMsg}"
      
      آپ کے فرائض:
      1. سائل کے نام اور والدہ کے نام کے اعداد 'ابجدِ قمری' سے نکال کر واضح لکھیں۔
      2. ان اعداد سے سائل کا ستارہ اور برج (Zodiac) معلوم کر کے بتائیں۔
      3. موجودہ مسئلے کی روحانی تشخیص کریں (نظرِ بد، حسد یا رکاوٹ)۔
      4. "وارننگ": کوئی عددی نقش یا مربع ہرگز نہ بنائیں، کیونکہ اس کے لیے زکوٰۃ اور اجازتِ خاص لازم ہے۔
      5. علاج کے لیے صرف 'اسمائے حسنیٰ'، 'قرآنی آیات' اور 'صدقہ' تجویز کریں۔
      6. گفتگو کا انداز نہایت مؤدبانہ، مخلصانہ اور دعائیہ رکھیں۔`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        setMessages(prev => [...prev, { role: 'bot', text: text }]);
      }
    } catch (error: any) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: 'معذرت، رابطہ کرنے میں دشواری ہو رہی ہے۔ شاید انٹرنیٹ کا مسئلہ ہے یا کی (Key) بلاک ہو گئی ہے۔ براہِ کرم دوبارہ کوشش فرمائیں۔' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f1] flex flex-col items-center p-2 sm:p-4 font-['Noto_Nastaliq_Urdu']" dir="rtl">
      
      {/* روحانی ہیڈر ڈیزائن */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#064e3b] to-[#065f46] text-[#fbbf24] rounded-t-3xl p-6 text-center shadow-2xl border-b-4 border-[#92400e]">
        <ShieldCheck size={40} className="mx-auto mb-2 text-[#fbbf24]" />
        <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">سلسلہ قادریہ رضویہ</h1>
        <p className="text-sm text-white/90 font-sans tracking-widest mt-1 uppercase">روحانی تشخیص و مشاورتی سینٹر</p>
      </div>

      {/* پیغامات کا خانہ */}
      <div className="w-full max-w-2xl bg-white h-[60vh] overflow-y-auto p-4 shadow-xl border-x-2 border-emerald-900/10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} mb-6`}>
            <div className={`max-w-[90%] p-5 rounded-3xl shadow-md ${
              m.role === 'user' 
              ? 'bg-[#e8f5e9] text-[#1b5e20] border-r-4 border-emerald-600 rounded-tr-none' 
              : 'bg-[#f8fafc] text-[#1e293b] border-l-4 border-amber-600 rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-2 text-[10px] font-bold opacity-40">
                {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span>{m.role === 'user' ? 'سائل' : 'روحانی مشیر'}</span>
              </div>
              <p className="text-lg leading-[2] whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end mb-4 animate-pulse">
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 italic">
              حساب و تشخیص جاری ہے، تھوڑا انتظار فرمائیں...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* سوال لکھنے کی جگہ */}
      <div className="w-full max-w-2xl bg-white p-4 rounded-b-3xl shadow-2xl border-t border-emerald-50">
        <div className="relative flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="نام، والدہ کا نام اور مسئلہ تحریر کریں..."
            className="w-full p-4 rounded-2xl border-2 border-emerald-50 focus:border-emerald-600 focus:outline-none text-lg resize-none shadow-inner"
            rows={2}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="p-4 bg-[#064e3b] text-white rounded-2xl hover:bg-emerald-900 shadow-lg active:scale-95 disabled:bg-gray-300"
          >
            <Send size={24} />
          </button>
        </div>
      </div>

      {/* فوری بٹنز */}
      <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-2xl px-2 pb-6">
        <button onClick={() => setInput("نام: [نام]، والدہ کا نام: [والدہ]۔ کاروبار کی بندش کا حساب کر دیں۔")} 
          className="flex items-center justify-center gap-2 p-3 bg-white border border-emerald-200 rounded-xl text-sm text-emerald-900 shadow-sm">
          <Calculator size={16} /> رزق کی بندش
        </button>
        <button onClick={() => setInput("نظرِ بد کی تشخیص اور قرآنی علاج بتائیں۔")} 
          className="flex items-center justify-center gap-2 p-3 bg-white border border-amber-200 rounded-xl text-sm text-amber-900 shadow-sm">
          <HeartPulse size={16} /> نظرِ بد کا علاج
        </button>
      </div>
    </div>
  );
}

export default App;