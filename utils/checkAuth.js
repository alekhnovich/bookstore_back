import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');//удаляем слово Bearer и заменяем на пустую строку
  
  if(token){
    try{
      const decoded = jwt.verify(token, 'secret123');//расшифровка токена
      req.userId = decoded._id;//сохранение в юзер айди
      next();//всё ок, делай следующую функцию
    } catch(err){
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else{
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
}