import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  kullanici: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  siparisKalemleri: [
    {
      isim: { type: String, required: true },
      adet: { type: Number, required: true },
      resimUrl: { type: String, required: true },
      fiyat: { type: Number, required: true },
      urun: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      }
    }
  ],
  kargoAdresi: {
    type: String,
    required: true
  },
  toplamTutar: {
    type: Number,
    required: true,
    default: 0.0
  },
  siparisDurumu: {
    type: String,
    required: true,
    default: 'Hazırlanıyor',
    enum: ['Hazırlanıyor', 'Kargoda', 'Teslim Edildi', 'İptal Edildi']
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
