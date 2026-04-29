// Basit Türkçe Duygu Analizi (Sentiment Analyzer)
// Pozitif ve negatif kelime listelerine dayalı skorlama

const pozitifKelimeler = [
  'harika', 'müthiş', 'mükemmel', 'süper', 'güzel', 'iyi', 'kaliteli', 'başarılı',
  'hızlı', 'rahat', 'konforlu', 'sağlam', 'dayanıklı', 'şık', 'modern', 'pratik',
  'memnun', 'tavsiye', 'teşekkür', 'sevdim', 'beğendim', 'bayıldım', 'kusursuz',
  'muhteşem', 'olağanüstü', 'fantastik', 'ideal', 'efsane', 'bomba', 'fiyatına',
  'değer', 'sorunsuz', 'pürüzsüz', 'parlak', 'temiz', 'hoş', 'enfes', 'fena değil',
  'ederim', 'aldım', 'mutlu', 'keyifli', 'verimli', 'performanslı', 'etkileyici'
];

const negatifKelimeler = [
  'kötü', 'berbat', 'rezalet', 'bozuk', 'arızalı', 'yavaş', 'pahalı', 'kalitesiz',
  'çürük', 'pişman', 'iade', 'sorunlu', 'eksik', 'yetersiz', 'düşük', 'zayıf',
  'hayal kırıklığı', 'kırık', 'çalışmıyor', 'lekeliydi', 'geç', 'gecikme', 'hasarlı',
  'sahte', 'taklit', 'korkunç', 'dandik', 'ucuz', 'vasat', 'sıkıntılı', 'problemli',
  'hatalı', 'yanıltıcı', 'felaket', 'çöp', 'beğenmedim', 'sevmedim', 'olmamış',
  'başarısız', 'mutsuz', 'sinir', 'rahatsız', 'pişmanlık', 'gereksiz', 'çirkin'
];

export const analyzeSentiment = (text) => {
  if (!text || text.trim().length === 0) return { score: 50, sentiment: 'neutral' };

  const lowerText = text.toLowerCase().replace(/[.,!?;:()]/g, '');
  const words = lowerText.split(/\s+/);

  let pozitifSayi = 0;
  let negatifSayi = 0;

  words.forEach(word => {
    if (pozitifKelimeler.some(pk => word.includes(pk))) pozitifSayi++;
    if (negatifKelimeler.some(nk => word.includes(nk))) negatifSayi++;
  });

  // Çok kelimeli ifadeleri de kontrol et
  pozitifKelimeler.forEach(pk => {
    if (pk.includes(' ') && lowerText.includes(pk)) pozitifSayi++;
  });
  negatifKelimeler.forEach(nk => {
    if (nk.includes(' ') && lowerText.includes(nk)) negatifSayi++;
  });

  const toplam = pozitifSayi + negatifSayi;

  if (toplam === 0) return { score: 50, sentiment: 'neutral' };

  const score = Math.round((pozitifSayi / toplam) * 100);

  let sentiment;
  if (score >= 60) sentiment = 'positive';
  else if (score <= 40) sentiment = 'negative';
  else sentiment = 'neutral';

  return { score, sentiment };
};
