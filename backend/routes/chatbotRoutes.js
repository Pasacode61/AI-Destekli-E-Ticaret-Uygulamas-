import express from 'express';
import { chat } from '../controllers/chatbotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Chatbot'a hem giriş yapmış hem yapmamış kullanıcılar erişebilir
// Ancak giriş yapmışsa sipariş sorgusu yapabilir
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const jwt = await import('jsonwebtoken');
      const User = (await import('../models/User.js')).default;
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'gizli_anahtar_123');
      req.user = await User.findById(decoded.id).select('-sifre');
    } catch (error) {
      // Token geçersizse bile devam et, sadece req.user null olur
    }
  }
  next();
};

router.route('/').post(optionalAuth, chat);

export default router;
