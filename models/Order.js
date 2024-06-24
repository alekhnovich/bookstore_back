import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }], // Ссылка на книги в заказе
});

export default mongoose.model('Order', orderSchema);

