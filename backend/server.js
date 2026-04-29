import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Rotalar
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Çevresel değişkenleri yükle
dotenv.config();

// Veritabanına bağlan
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body verilerini parse etmek için (JSON)
app.use(express.urlencoded({ extended: true }));

// Rotaları kullan
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Kök dizin (Test)
app.get('/', (req, res) => {
  res.send('AI Destekli E-Ticaret Backend API Çalışıyor...');
});

// Hata yakalama middleware'i (Basit versiyon)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
