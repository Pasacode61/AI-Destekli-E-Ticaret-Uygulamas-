import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  kullanici: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  urun: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  puan: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  yorumMetni: {
    type: String,
    required: true
  },
  duyguSkoru: {
    type: Number,
    default: 0 // AI sentiment analysis score
  }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
