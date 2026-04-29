import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Merhaba! 👋 Ben AI Store asistanıyım. Size nasıl yardımcı olabilirim?', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: userMessage, type: 'text' }]);
    setLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user) headers.Authorization = `Bearer ${user.token}`;

      const res = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();

      setMessages(prev => [...prev, {
        from: 'bot',
        text: data.reply,
        type: data.type,
        products: data.products || []
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.', type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center group hover:scale-110"
      >
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold">AI Asistan</h3>
              <p className="text-xs text-indigo-200">Her zaman yardıma hazır</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.from === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  {/* Ürün kartları */}
                  {msg.type === 'products' && msg.products?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.products.map(p => (
                        <Link
                          key={p._id}
                          to={`/products/${p._id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 bg-white rounded-xl p-2 hover:shadow-md transition-all border border-gray-100"
                        >
                          <img src={p.resimUrl} alt={p.isim} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 line-clamp-1">{p.isim}</p>
                            <p className="text-xs font-bold text-indigo-600">{p.fiyat.toLocaleString('tr-TR')} ₺</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Bir şey sorun..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
