import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const mockProducts = [
  {
    isim: "Akıllı Telefon Pro Max",
    fiyat: 45999,
    kategori: "Elektronik",
    resimUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
    acikArtirmadaMi: false,
    aciklama: "En son teknoloji ile donatılmış amiral gemisi akıllı telefon.",
    stokSayisi: 15
  },
  {
    isim: "Gürültü Önleyici Kablosuz Kulaklık",
    fiyat: 4500,
    kategori: "Elektronik",
    resimUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop",
    acikArtirmadaMi: false,
    aciklama: "Dış dünyadan tamamen soyutlanarak müziğin tadını çıkarın.",
    stokSayisi: 30
  },
  {
    isim: "Mekanik Oyuncu Klavyesi",
    fiyat: 2450,
    kategori: "Bilgisayar Bileşenleri",
    resimUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
    acikArtirmadaMi: true,
    aciklama: "Hızlı tepkime süresi ve özelleştirilebilir RGB aydınlatma.",
    stokSayisi: 5
  },
  {
    isim: "Akıllı Saat Ultra",
    fiyat: 12999,
    kategori: "Giyilebilir Teknoloji",
    resimUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop",
    acikArtirmadaMi: false,
    aciklama: "Sağlık takibiniz ve spor aktiviteleriniz için en iyi yardımcınız.",
    stokSayisi: 20
  },
  {
    isim: "Ergonomik Çalışma Koltuğu",
    fiyat: 7500,
    kategori: "Mobilya",
    resimUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=800&auto=format&fit=crop",
    acikArtirmadaMi: false,
    aciklama: "Uzun saatler bilgisayar başında oturanlar için ideal bel ve boyun desteği.",
    stokSayisi: 10
  },
  {
    isim: "4K Aksiyon Kamerası",
    fiyat: 9200,
    kategori: "Kamera",
    resimUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop",
    acikArtirmadaMi: true,
    aciklama: "Aksiyon dolu anlarınızı en yüksek çözünürlükte kaydedin.",
    stokSayisi: 8
  },
  {
    isim: "Minimalist Ahşap Çalışma Masası",
    fiyat: 4800,
    kategori: "Mobilya",
    resimUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800&auto=format&fit=crop",
    acikArtirmadaMi: false,
    aciklama: "Sade tasarımıyla ofisinize veya evinize modern bir hava katar.",
    stokSayisi: 12
  },
  {
    isim: "Taşınabilir Bluetooth Hoparlör",
    fiyat: 1850,
    kategori: "Elektronik",
    resimUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop",
    acikArtirmadaMi: false,
    aciklama: "Gittiğiniz her yere müziğinizi yüksek kalitede taşıyın.",
    stokSayisi: 50
  },
  {
    isim: "Yüksek Performanslı Oyuncu Laptopu",
    fiyat: 62500,
    kategori: "Bilgisayar",
    resimUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop",
    acikArtirmadaMi: true,
    aciklama: "Yeni nesil oyunları en yüksek ayarlarda sorunsuz oynayın.",
    stokSayisi: 3
  },
  {
    isim: "Akıllı Ev Asistanı",
    fiyat: 2100,
    kategori: "Akıllı Ev",
    resimUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=800&auto=format&fit=crop",
    acikArtirmadaMi: false,
    aciklama: "Evinizi sesinizle yönetin, günlük işlerinizi asistanınıza bırakın.",
    stokSayisi: 40
  }
];

const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing
    await Product.deleteMany(); 
    
    // Insert new data
    await Product.insertMany(mockProducts);
    
    console.log('Veriler başarıyla eklendi!');
    process.exit();
  } catch (error) {
    console.error(`Hata: ${error.message}`);
    process.exit(1);
  }
};

importData();
