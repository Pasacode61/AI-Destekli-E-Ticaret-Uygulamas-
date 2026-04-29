import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@admin.com' });

    if (!adminExists) {
      await User.create({
        adSoyad: 'Sistem Yöneticisi',
        email: 'admin@admin.com',
        sifre: '123456',
        rol: 'admin'
      });
      console.log('Admin hesabı başarıyla oluşturuldu.');
    } else {
      console.log('Admin hesabı zaten mevcut.');
    }

    process.exit();
  } catch (error) {
    console.error(`Hata: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
