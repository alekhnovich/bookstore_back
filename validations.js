import { body } from 'express-validator'

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),//если email корректный, то пропускаем
  body('password', 'Длина пароля должна быть минимум 5 символов').isLength({ min: 5}), //если длина пароля 5 то норм
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),//если email корректный, то пропускаем
  body('password', 'Длина пароля должна быть минимум 5 символов').isLength({ min: 5}), //если длина пароля 5 то норм
  body('fullName', 'Укажите имя').isLength({ min: 3}),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),//если не придёт, то ок, если придёт - проверь на ссылку
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),//потом убрать optional
];