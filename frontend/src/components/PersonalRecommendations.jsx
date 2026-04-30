import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PersonalRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const fetchPersonal = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/recommendations/personal', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Kişisel öneriler alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonal();
  }, [user]);

  if (!user || loading || recommendations.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Size Özel Öneriler</h2>
            <p className="text-gray-500 text-sm">Yapay zeka, alışveriş geçmişinize göre bu ürünleri seçti</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.slice(0, 4).map((product) => (
            <Link to={`/products/${product._id}`} key={product._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
              <div className="h-44 overflow-hidden bg-gray-100">
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
    </section>
  );
}
