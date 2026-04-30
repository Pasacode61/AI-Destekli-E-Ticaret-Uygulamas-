import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Siparişler getirilemedi.');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return <div className="text-center py-20 text-xl font-medium text-gray-500">Siparişleriniz yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Siparişlerim</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Henüz siparişiniz bulunmuyor</h2>
          <p className="text-gray-500 mb-6">Alışverişe başlamak için ürünlerimize göz atabilirsiniz.</p>
          <Link to="/products" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
            Ürünleri Keşfet
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sipariş Tarihi</p>
                  <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Toplam Tutar</p>
                  <p className="font-semibold text-indigo-600">{order.toplamTutar.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Durum</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {order.siparisDurumu}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.siparisKalemleri.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img src={item.resimUrl} alt={item.isim} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                      <div className="flex-1">
                        <Link to={`/products/${item.urun}`} className="font-semibold text-gray-900 hover:text-indigo-600">
                          {item.isim}
                        </Link>
                        <p className="text-gray-500 text-sm">{item.adet} adet x {item.fiyat.toLocaleString('tr-TR')} ₺</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Teslimat Adresi</h4>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{order.kargoAdresi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
