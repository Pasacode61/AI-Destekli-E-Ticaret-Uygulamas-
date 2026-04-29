import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token'ı al (Bearer df84j39dfj...)
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar_123');

      // Kullanıcıyı bul ve req.user içine at (şifre hariç)
      req.user = await User.findById(decoded.id).select('-sifre');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Yetkilendirme başarısız, token geçersiz' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Yetkilendirme başarısız, token bulunamadı' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Yönetici (Admin) yetkisi gerekli' });
  }
};
