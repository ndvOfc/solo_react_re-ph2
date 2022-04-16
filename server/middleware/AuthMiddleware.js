/* eslint-disable func-names */
const ApiError = require('../exceptions/ApiError');
const tokenService = require('../services/tokenService');

module.exports = function (req, res, next) {
  try {
    // достаем токен из заголовка
    const authHeader = req.headers.authorization;

    // если в хэдере нет токена, кидаем ошибку
    if (!authHeader) {
      throw next(ApiError.unAuthorized('Вы не авторизованны'));
    }

    // достаем access токен (сплитом убираем Bearer)
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      throw next(ApiError.unAuthorized());
    }

    // access токен который достали необходимо провалидировать
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      throw ApiError.unAuthorized();
    }

    // вносим данные из токена полученного при валидации
    req.user = userData;

    next();
  } catch (e) {
    next();
  }
};
