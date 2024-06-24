import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';

export const validateOrder = [
  body('name').notEmpty().withMessage('Имя обязательно'),
  body('phone').notEmpty().withMessage('Телефон обязателен'),
  body('cardNumber')
    .isLength({ min: 16, max: 16 })
    .withMessage('Номер карты должен содержать 16 цифр')
    .isNumeric()
    .withMessage('Номер карты должен содержать только цифры'),
  body('address').notEmpty().withMessage('Адрес обязателен'),
  body('items').isArray().withMessage('Должен быть массив книг'),
];

export const getOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, phone, cardNumber, address, items } = req.body;

    // Создаем новый заказ в базе данных
    const order = await Order.create({ name, phone, cardNumber, address, items });

    // Отправляем клиенту ответ с созданным заказом
    res.status(201).json(order);
  } catch (error) {
    // Если произошла ошибка, отправляем клиенту сообщение об ошибке
    res.status(500).json({ error: 'Ошибка при создании заказа' });
  }
};
