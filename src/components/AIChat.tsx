import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `你現在是「阿爸的家園 Healthy Nutrition Center」的 AI 智能客服。
請以親切、專業、熱情的語氣回答顧客的問題。
以下是我們的商店資訊：
- 商店名稱：阿爸的家園 Healthy Nutrition Center
- 地址：台北市大同區承德路一段23號1樓
- 電話：0906-000-923 / 02-25236643
- 營業時間：週一至週五 早上7:30-11:30 (其他時間改預約制)
- 外送費：NT$30，外送時間約 20-30 分鐘。

我們的菜單包含：
1. 特惠體驗：營養代餐體驗組 (NT$49)
2. 增肌減脂餐：舒肥雞胸肉餐盒 (NT$120)、鹽烤鮭魚藜麥飯 (NT$150)、低脂牛肉鮮蔬餐 (NT$140)
3. 運動營養餐：高蛋白雙拼餐盒 (NT$180)、能量地瓜雞肉捲 (NT$110)
4. 兒童健康餐：快樂小熊飯糰餐 (NT$90)、營養滿分玉子燒便當 (NT$100)
5. 健康飲品：高蛋白營養奶昔 (NT$80)、鮮榨綠拿鐵 (NT$90)

請根據以上資訊回答顧客問題。如果顧客問到菜單上沒有的東西，請委婉告知目前沒有提供，並推薦現有餐點。如果顧客想訂餐，請引導他們使用網頁上的購物車功能。`;

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'model', text: '您好！我是阿爸的家園智能客服，請問有什麼我可以幫忙的嗎？（例如：請問營業時間？有推薦的減脂餐嗎？）' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session lazily
  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("請在左側 Settings -> Secrets 中設定 GEMINI_API_KEY");
      }

      if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
        chatRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          }
        });
      }

      const response = await chatRef.current.sendMessage({ message: userText });
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response.text || '抱歉，我現在有點無法思考，請稍後再試。' 
      }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: `抱歉，系統發生錯誤：${error?.message || '未知錯誤'}。請確認 API Key 是否設定正確。` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-full shadow-xl hover:bg-green-700 transition-transform hover:scale-105 z-40 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-green-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={24} />
                <h3 className="font-bold text-lg">智能客服</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-green-700 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-green-600 text-white rounded-tr-sm' 
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 shadow-sm border border-gray-100 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-green-600" />
                    <span className="text-sm text-gray-500">正在思考...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1 pr-2 border border-gray-200 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="輸入您的問題..."
                  className="flex-1 bg-transparent px-4 py-2 outline-none text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 transition-colors"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
