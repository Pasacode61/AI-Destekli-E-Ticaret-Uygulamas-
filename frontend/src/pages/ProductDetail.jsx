import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auction states
  const [currentBid, setCurrentBid] = useState(0);
  const [userBid, setUserBid] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600 * 24); // 24 hours countdown for demo

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) throw new Error('Ürün bulunamadı');
        const data = await response.json();
        setProduct(data);
        setCurrentBid(data.fiyat);
        setLoading(false);
      } catch (error) {
        console.error("Hata:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Generate mock price history data based on current price
  const priceHistory = useMemo(() => {
    if (!product) return [];
    const base = product.fiyat;
    return [
      { name: 'Oca', fiyat: Math.round(base * 0.85) },
      { name: 'Şub', fiyat: Math.round(base * 0.90) },
      { name: 'Mar', fiyat: Math.round(base * 1.05) },
      { name: 'Nis', fiyat: Math.round(base * 1.15) },
      { name: 'May', fiyat: Math.round(base * 1.05) },
      { name: 'Haz', fiyat: base }, // Current price
    ];
  }, [product]);

  // Determine AI Advice
  const aiAdvice = useMemo(() => {
    if (!product) return null;
    const history = priceHistory;
    const latestPrice = history[history.length - 1].fiyat;
    const previousPrice = history[history.length - 2].fiyat;
    
    if (latestPrice < previousPrice) {
      return { type: 'buy', text: 'Hemen Al', color: 'bg-green-100 text-green-800 border-green-200', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', description: 'Yapay zeka analizine göre fiyat şu anda düşüş trendinde. Almak için harika bir zaman!' };
    } else if (latestPrice > previousPrice * 1.02) {
      return { type: 'wait', text: 'Bekle', color: 'bg-red-100 text-red-800 border-red-200', icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6', description: 'Fiyat son dönemde artış göstermiş. Algoritmamız fiyatın yakında düşebileceğini öngörüyor.' };
    } else {
      return { type: 'buy', text: 'Alınabilir', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'M5 13l4 4L19 7', description: 'Fiyat stabil. İhtiyacınız varsa gönül rahatlığıyla alabilirsiniz.' };
    }
  }, [priceHistory]);

  // Mock comments
  const comments = [
    { id: 1, user: "Ahmet Y.", date: "12 Haziran 2026", text: "Ürün tek kelimeyle harika, beklentilerimi fazlasıyla karşıladı.", sentiment: "positive", score: 95 },
    { id: 2, user: "Ayşe K.", date: "05 Haziran 2026", text: "Kargolama biraz yavaştı ama ürünün kalitesi fena değil.", sentiment: "neutral", score: 60 },
    { id: 3, user: "Mehmet D.", date: "28 Mayıs 2026", text: "Fiyatına göre performansı inanılmaz iyi, kesinlikle tavsiye ederim.", sentiment: "positive", score: 88 },
  ];

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <span className="text-2xl" title="Pozitif">😊</span>;
      case 'neutral': return <span className="text-2xl" title="Nötr">😐</span>;
      case 'negative': return <span className="text-2xl" title="Negatif">😡</span>;
      default: return null;
    }
  };

  useEffect(() => {
    if (!product?.acikArtirmadaMi) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [product?.acikArtirmadaMi]);

  if (loading) {
    return <div className="text-center py-24 text-xl">Ürün yükleniyor...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h2>
        <p className="text-gray-500 mb-8">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Link to="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Ürünlere Dön
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handlePlaceBid = () => {
    const bidAmount = parseInt(userBid);
    if (isNaN(bidAmount) || bidAmount <= currentBid) {
      alert("Lütfen mevcut tekliften daha yüksek bir tutar girin.");
      return;
    }
    setCurrentBid(bidAmount);
    setUserBid('');
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-lg">
          <p className="font-semibold text-gray-700 mb-1">{label}</p>
          <p className="text-indigo-600 font-bold">
            {payload[0].value.toLocaleString('tr-TR')} ₺
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-8 group font-medium"
      >
        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Geri Dön
      </button>

      {/* Product Main Details */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row mb-12">
        <div className="w-full md:w-1/2 relative">
          <div className="aspect-w-1 aspect-h-1 md:aspect-none h-96 md:h-full min-h-[400px]">
            <img 
              src={product.resimUrl} 
              alt={product.isim} 
              className="w-full h-full object-cover"
            />
          </div>
          {product.acikArtirmadaMi && (
            <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
              Açık Artırmada
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-indigo-600 text-sm font-bold uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              {product.kategori}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 mb-4 leading-tight">
            {product.isim}
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Yapay zeka analizimize göre bu ürün, aradığınız özelliklere %94 oranında uyum sağlıyor. 
            Yüksek müşteri memnuniyeti ve dayanıklılığı ile öne çıkan bu {product.kategori.toLowerCase()} ürünü, 
            beklentilerinizi fazlasıyla karşılayacak.
          </p>
          
          {!product.acikArtirmadaMi && (
            <div className="flex items-center gap-4 mb-8">
              <div className="text-4xl md:text-5xl font-black text-gray-900">
                {product.fiyat.toLocaleString('tr-TR')} ₺
              </div>
            </div>
          )}
          
          <div className="mt-auto pt-8 border-t border-gray-100">
            {product.acikArtirmadaMi ? (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="text-orange-800 font-bold text-lg flex items-center gap-2">
                    <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Kapanışa Kalan Süre:
                  </h3>
                  <div className="text-2xl font-black text-orange-600 bg-white px-5 py-2 rounded-xl shadow-sm border border-orange-100 font-mono tracking-wider">
                    {formatTime(timeLeft)}
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl mb-6 shadow-sm border border-orange-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-gray-500 font-medium">Mevcut En Yüksek Teklif:</span>
                  <span className="text-4xl font-black text-gray-900">{currentBid.toLocaleString('tr-TR')} ₺</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="number" 
                    value={userBid}
                    onChange={(e) => setUserBid(e.target.value)}
                    placeholder={`${(currentBid + 100).toLocaleString('tr-TR')} ₺ veya üzeri`}
                    className="flex-grow px-5 py-4 rounded-xl border-2 border-orange-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none text-lg font-bold text-gray-900 transition-all placeholder-gray-400"
                  />
                  <button 
                    onClick={handlePlaceBid}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-xl transition-colors shadow-lg shadow-orange-200 flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    Teklif Ver
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:transform active:scale-[0.98]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Sepete Ekle
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Analysis and Price History Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Yapay Zeka Fiyat Analizi
        </h2>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="h-72 w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280' }} 
                  domain={['dataMin - 1000', 'auto']}
                  tickFormatter={(value) => `${value.toLocaleString('tr-TR')}₺`}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="fiyat" 
                  stroke="#4f46e5" 
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#4f46e5', strokeWidth: 0 }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#4338ca' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {aiAdvice && (
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center gap-6 ${aiAdvice.color}`}>
              <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-50">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={aiAdvice.icon} />
                </svg>
              </div>
              <div className="text-center md:text-left flex-grow">
                <h3 className="text-xl font-black mb-1 tracking-wide">Yapay Zeka Tavsiyesi: {aiAdvice.text}</h3>
                <p className="opacity-90 font-medium text-lg">{aiAdvice.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews and Sentiment Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Değerlendirmeler & Duygu Analizi
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Global Sentiment Summary */}
          <div className="col-span-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white flex flex-col justify-center items-center text-center shadow-lg">
            <div className="text-6xl mb-4">😊</div>
            <div className="text-4xl font-black mb-2">92/100</div>
            <h3 className="text-xl font-bold mb-2">Genel Duygu Skoru</h3>
            <p className="text-indigo-100">
              Yapay zeka algoritmamız bu ürün için yapılan tüm yorumları analiz etti ve genel müşteri memnuniyetinin <strong>çok yüksek</strong> olduğunu belirledi.
            </p>
          </div>

          {/* Comments List */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                <div className="flex-shrink-0 flex flex-col items-center justify-start gap-1">
                  {getSentimentIcon(comment.sentiment)}
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    comment.sentiment === 'positive' ? 'bg-green-100 text-green-700' : 
                    comment.sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    Skor: {comment.score}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-gray-900">{comment.user}</h4>
                    <span className="text-sm text-gray-400">• {comment.date}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            ))}
            
            <button className="mt-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors py-2 px-4 rounded-xl hover:bg-indigo-50 self-start">
              Tüm Yorumları Gör (128) &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
