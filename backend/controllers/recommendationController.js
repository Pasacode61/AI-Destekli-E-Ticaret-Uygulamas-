import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Ürüne göre benzer ürün önerileri (Kategori + Fiyat yakınlığı)
// @route   GET /api/recommendations/:productId
// @access  Public
export const getRecommendations = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    // Aynı kategorideki diğer ürünleri bul, fiyat yakınlığına göre sırala
    const recommendations = await Product.find({
      _id: { $ne: product._id },
      kategori: product.kategori
    }).limit(4);

    // Eğer aynı kategoride yeterli ürün yoksa, fiyat aralığı yakın ürünleri ekle
    if (recommendations.length < 4) {
      const remaining = 4 - recommendations.length;
      const existingIds = [product._id, ...recommendations.map(r => r._id)];

      const priceRange = product.fiyat * 0.5;
      const extra = await Product.find({
        _id: { $nin: existingIds },
        fiyat: { $gte: product.fiyat - priceRange, $lte: product.fiyat + priceRange }
      }).limit(remaining);

      recommendations.push(...extra);
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Kullanıcıya özel öneriler (Geçmiş siparişlerdeki kategorilere göre)
// @route   GET /api/recommendations/personal
// @access  Private
export const getPersonalRecommendations = async (req, res) => {
  try {
    // Kullanıcının geçmiş siparişlerini bul
    const orders = await Order.find({ kullanici: req.user._id });

    // Sipariş edilen ürün ID'lerini topla
    const orderedProductIds = [];
    orders.forEach(order => {
      order.siparisKalemleri.forEach(item => {
        if (item.urun) orderedProductIds.push(item.urun);
      });
    });

    // Sipariş edilen ürünlerin bilgilerini çek (kategori almak için)
    const orderedProducts = await Product.find({ _id: { $in: orderedProductIds } });
    const categories = [...new Set(orderedProducts.map(p => p.kategori))];

    let recommendations;

    if (categories.length > 0) {
      // Kullanıcının daha önce aldığı kategorilerden, almadığı ürünleri öner
      recommendations = await Product.find({
        _id: { $nin: orderedProductIds },
        kategori: { $in: categories }
      }).limit(8);
    }

    // Eğer yeterli öneri yoksa veya hiç sipariş yoksa, popüler ürünleri göster
    if (!recommendations || recommendations.length < 4) {
      const existingIds = recommendations ? recommendations.map(r => r._id) : [];
      const remaining = 8 - (recommendations ? recommendations.length : 0);

      const popular = await Product.find({
        _id: { $nin: [...orderedProductIds, ...existingIds] }
      }).limit(remaining);

      recommendations = recommendations ? [...recommendations, ...popular] : popular;
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
