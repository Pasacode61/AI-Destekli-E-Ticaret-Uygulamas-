import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Hata:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['Tümü', ...new Set(products.map(p => p.kategori))];

  const filteredProducts = selectedCategory === 'Tümü' 
    ? products 
    : products.filter(p => p.kategori === selectedCategory);

  if (loading) return <div className="text-center py-20">Yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Ürünlerimiz</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col h-full group">
            <Link to={`/products/${product._id}`} className="relative h-48 overflow-hidden bg-gray-100 block">
              <img 
                src={product.resimUrl} 
                alt={product.isim} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.acikArtirmadaMi && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                  Açık Artırmada
                </div>
              )}
            </Link>
            <div className="p-5 flex flex-col flex-grow">
              <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
                {product.kategori}
              </div>
              <Link to={`/products/${product._id}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-2">
                  {product.isim}
                </h3>
              </Link>
              <div className="mt-auto pt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">
                  {product.fiyat.toLocaleString('tr-TR')} ₺
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Ekle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Bu kategoride ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
