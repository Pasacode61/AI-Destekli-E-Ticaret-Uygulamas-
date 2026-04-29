import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Hazır cevap şablonları
const faqResponses = {
  iade: 'İade işlemi için siparişinizin teslim tarihinden itibaren 14 gün içinde "Siparişlerim" sayfasından iade talebi oluşturabilirsiniz. Ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir.',
  kargo: 'Siparişleriniz genellikle 1-3 iş günü içinde kargoya verilir. Kargo takip numaranız sipariş durumunuz "Kargoda" olduğunda e-posta ile gönderilir.',
  ödeme: 'Şu anda Kapıda Ödeme seçeneği ile alışveriş yapabilirsiniz. Kredi kartı ile ödeme seçeneği yakında aktif edilecektir.',
  iletişim: 'Bize destek@aistore.com adresinden veya 0850 123 45 67 numaralı telefondan ulaşabilirsiniz. Çalışma saatlerimiz hafta içi 09:00-18:00 arasındadır.',
  güvenlik: 'Tüm kişisel verileriniz SSL şifrelemesi ile korunmaktadır. Şifreniz bcrypt algoritması ile hash\'lenerek saklanır.',
  merhaba: 'Merhaba! 👋 Size nasıl yardımcı olabilirim? Ürün araması yapabilir, sipariş durumunuzu sorgulayabilir veya genel sorularınızı sorabilirsiniz.',
  selam: 'Selam! 👋 Ben AI Store asistanıyım. Sana nasıl yardımcı olabilirim?',
};

// Anahtar kelimeden FAQ yanıtı bul
const findFaqResponse = (message) => {
  const lowerMsg = message.toLowerCase();
  for (const [key, value] of Object.entries(faqResponses)) {
    if (lowerMsg.includes(key)) return value;
  }
  return null;
};

// @desc    Chatbot ile mesajlaşma
// @route   POST /api/chatbot
// @access  Public (opsiyonel auth ile kişisel sorgu)
export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.json({ reply: 'Lütfen bir mesaj yazınız.', type: 'text' });
    }

    const lowerMsg = message.toLowerCase();

    // 1. FAQ kontrolü
    const faqReply = findFaqResponse(message);
    if (faqReply) {
      return res.json({ reply: faqReply, type: 'text' });
    }

    // 2. Ürün arama
    const aramaAnahtar = ['arıyorum', 'istiyorum', 'öner', 'bak', 'ara', 'var mı', 'göster'];
    const isProductSearch = aramaAnahtar.some(k => lowerMsg.includes(k));

    if (isProductSearch) {
      // Mesajdan arama terimini çıkar
      const products = await Product.find({
        $or: [
          { isim: { $regex: lowerMsg.split(' ').filter(w => w.length > 2).join('|'), $options: 'i' } },
          { kategori: { $regex: lowerMsg.split(' ').filter(w => w.length > 2).join('|'), $options: 'i' } }
        ]
      }).limit(4);

      if (products.length > 0) {
        return res.json({
          reply: `Size uygun ${products.length} ürün buldum:`,
          type: 'products',
          products: products.map(p => ({
            _id: p._id,
            isim: p.isim,
            fiyat: p.fiyat,
            resimUrl: p.resimUrl,
            kategori: p.kategori
          }))
        });
      } else {
        return res.json({ reply: 'Maalesef aradığınız kriterlere uygun ürün bulamadım. Farklı bir terim ile aramayı deneyebilirsiniz.', type: 'text' });
      }
    }

    // 3. Sipariş durumu sorgulama
    const siparisAnahtar = ['sipariş', 'siparişim', 'kargom', 'nerede', 'durum'];
    const isOrderQuery = siparisAnahtar.some(k => lowerMsg.includes(k));

    if (isOrderQuery && req.user) {
      const lastOrder = await Order.findOne({ kullanici: req.user._id }).sort({ createdAt: -1 });
      if (lastOrder) {
        return res.json({
          reply: `Son siparişinizin durumu: **${lastOrder.siparisDurumu}** (${new Date(lastOrder.createdAt).toLocaleDateString('tr-TR')}). Toplam tutar: ${lastOrder.toplamTutar.toLocaleString('tr-TR')} ₺`,
          type: 'text'
        });
      } else {
        return res.json({ reply: 'Henüz bir siparişiniz bulunmuyor.', type: 'text' });
      }
    }

    if (isOrderQuery && !req.user) {
      return res.json({ reply: 'Sipariş durumunuzu sorgulamak için lütfen giriş yapın.', type: 'text' });
    }

    // 4. Varsayılan cevap
    return res.json({
      reply: 'Anlayamadım, ama size yardımcı olmak istiyorum! Şunları deneyebilirsiniz:\n• Ürün araması: "laptop arıyorum"\n• Sipariş sorgulama: "siparişim nerede"\n• Sıkça sorulan sorular: "iade", "kargo", "ödeme"',
      type: 'text'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
