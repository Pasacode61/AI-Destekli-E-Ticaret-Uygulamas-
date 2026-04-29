import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
<<<<<<< Updated upstream
=======
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import ChatBot from './components/ChatBot';
>>>>>>> Stashed changes

function Navbar() {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const cartCount = getCartCount();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tight">AI Store</Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Anasayfa
              </Link>
              <Link to="/products" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Ürünler
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link to="/cart" className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex justify-center items-center h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/my-orders" className="text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors">
                  Siparişlerim
                </Link>
                <span className="text-sm font-medium text-gray-400 hidden sm:block">|</span>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  Hoş geldin, {user.adSoyad.split(' ')[0]}
                </span>
                <button 
                  onClick={logout}
                  className="text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            &copy; 2026 AI E-Ticaret. Tüm Hakları Saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
<<<<<<< Updated upstream
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Layout>
=======
          <Routes>
            {/* Admin Routes - kendi layout'unu kullanır */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>
            </Route>

            {/* Public / User Routes */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </Layout>
            } />
          </Routes>
          <ChatBot />
>>>>>>> Stashed changes
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
