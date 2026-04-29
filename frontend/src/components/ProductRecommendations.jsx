import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProductRecommendations({ productId }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!productId) return;
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/recommendations/${productId}`);
        const data = await res.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Öneriler alınamadı:', error);
      }
    };
    fetchRecommendations();
  }, [productId]);

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        AI Önerisi: Bunları da Beğenebilirsiniz
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <Link to={`/products/${product._id}`} key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
            <div className="h-40 overflow-hidden bg-gray-100">
              <img src={product.resimUrl} alt={product.isim} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4">
              <p className="text-xs text-indigo-600 font-semibold uppercase mb-1">{product.kategori}</p>
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{product.isim}</h3>
              <p className="text-lg font-black text-gray-900">{product.fiyat.toLocaleString('tr-TR')} ₺</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
