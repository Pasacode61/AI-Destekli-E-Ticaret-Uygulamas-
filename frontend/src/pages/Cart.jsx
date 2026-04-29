import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Sepetiniz</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center py-24">
          <svg className="mx-auto h-24 w-24 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-2xl text-gray-500 font-medium mb-2">Sepetiniz şu an boş</p>
          <p className="text-gray-400 mb-8">Alışverişe başlamak için ürünler sayfamıza göz atabilirsiniz.</p>
          <Link to="/products" className="inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md">
            Ürünleri Keşfet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Sepetiniz</h2>
        <button 
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 text-sm font-medium underline"
        >
          Sepeti Temizle
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img src={item.resimUrl} alt={item.isim} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow flex flex-col justify-between h-full py-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.isim}</h3>
                  <p className="text-sm text-gray-500">{item.kategori}</p>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-medium text-gray-900 border-x border-gray-200 min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-lg text-gray-900">
                      {(item.fiyat * item.quantity).toLocaleString('tr-TR')} ₺
                    </span>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Kaldır
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{getCartTotal().toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Kargo</span>
                <span className="text-green-600 font-medium">Ücretsiz</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Genel Toplam</span>
                <span className="text-2xl font-black text-indigo-600">
                  {getCartTotal().toLocaleString('tr-TR')} ₺
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md flex justify-center items-center gap-2"
            >
              Alışverişi Tamamla
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
