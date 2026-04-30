import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Lütfen kargo adresi giriniz.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        siparisKalemleri: cartItems.map(item => ({
          isim: item.isim,
          adet: item.quantity,
          resimUrl: item.resimUrl,
          fiyat: item.fiyat,
          urun: item._id
        })),
        kargoAdresi: address,
        toplamTutar: getCartTotal()
      };

      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Sipariş oluşturulurken bir hata oluştu.');
      }

      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Ödeme ve Onay</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Teslimat Bilgileri</h2>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleOrder}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Kargo Adresi</label>
              <textarea
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Açık adresinizi, ilçe ve il bilgisini giriniz..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 text-sm">
              <p className="font-bold mb-1">Bilgilendirme</p>
              <p>Sistemimizde şu anda test aşamasında olduğu için ödemeler teslimat sırasında (Kapıda Ödeme) tahsil edilecektir.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70"
            >
              {loading ? 'Siparişiniz Alınıyor...' : 'Siparişi Onayla'}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item._id} className="flex gap-4">
                  <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={item.resimUrl} alt={item.isim} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.isim}</h4>
                    <p className="text-sm text-gray-500">{item.quantity} adet x {item.fiyat.toLocaleString('tr-TR')} ₺</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{getCartTotal().toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Kargo</span>
                <span className="text-green-600 font-medium">Ücretsiz</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Ödenecek Tutar</span>
                <span className="text-2xl font-black text-indigo-600">{getCartTotal().toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
