import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';


export const register = async (req, res) => {//если придёт запрос в регистер, то проверим через валидатор
  try { 
  const password = req.body.password;//вытаскиваем пароль
  const salt = await bcrypt.genSalt(10);//генерим соль
  const hash = await bcrypt.hash(password, salt);//зашифрованный пароль

  const doc = UserModel({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    passwordHash: hash,
  });


  const user = await doc.save();

  const token = jwt.sign({
      _id: user._id,
    }, 
    'secret123',//ключ
    {
      expiresIn: '30d', //срок жизни токена
    },
  );

  const {passwordHash, ...userData} = user._doc;

  res.json({
    ...userData,
    token,
  });
  } catch(err){
    console.log(err); 
    res.status(500).json({// проблема сервера
      message: 'Не удалось зарегистрироваться',
    });
  }
}

export const login = async (req, res) => {
  try{
    const user = await UserModel.findOne({ email: req.body.email });// найти пользователя по условию

    if(!user){//если такой почты нет
      return res.status(404).json({//данных по заданному запросу на сервере нет
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);//проверь, сходятся ли пароль в теле запроса и в документе
    if(!isValidPass){
      return res.status(400).json({//данных по заданному запросу на сервере нет
        message: 'Неверный логин или пароль',
      });
    }
    const token = jwt.sign({
      _id: user._id,
    }, 
    'secret123',//ключ
    {
      expiresIn: '30d', //срок жизни токена
    },
  );
  const {passwordHash, ...userData} = user._doc;//вытаскиваем инфу о пользователе

  res.json({
    ...userData,
    token,
  });
  } catch(err){
    console.log(err); 
    res.status(500).json({// проблема сервера
      message: 'Не удалось авторизоваться',
    });
  }
}

export const getMe = async (req, res) => {//может ли пользователь получить инфу о себе по токену(авторизоан или нет)
  try {
    const user = await UserModel.findById(req.userId);//найти айди в бд
    if(!user){
      res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const {passwordHash, ...userData} = user._doc;//вытаскиваем инфу о пользователе

    res.json(userData);
  } catch(err) {
    console.log(err); 
    res.status(500).json({// проблема сервера
      message: 'Нет доступа',
    });
  }
}