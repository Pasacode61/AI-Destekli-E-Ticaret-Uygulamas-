import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Token üretme yardımcı fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'gizli_anahtar_123', {
    expiresIn: '30d',
  });
};

// @desc    Yeni kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { adSoyad, email, sifre } = req.body;

    // Email kullanılıyor mu kontrolü
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
    }

    // Kullanıcı oluştur
    const user = await User.create({
      adSoyad,
      email,
      sifre
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        adSoyad: user.adSoyad,
        email: user.email,
        rol: user.rol,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Geçersiz kullanıcı verisi' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Kullanıcı girişi & Token alma
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, sifre } = req.body;

    // Kullanıcıyı email'e göre bul ve şifreyi getirmesini iste (+sifre)
    const user = await User.findOne({ email }).select('+sifre');

    if (user && (await user.matchPassword(sifre))) {
      res.json({
        _id: user._id,
        adSoyad: user.adSoyad,
        email: user.email,
        rol: user.rol,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
