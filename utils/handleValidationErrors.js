import { validationResult } from "express-validator"

export default (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){//если валидация не прошла, верни мне список ошибок
    return res.status(404).json(errors.array());
  }

  next();
}