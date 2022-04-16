/* eslint-disable */
// noinspection GrazieInspection,JSUnusedGlobalSymbols

const jwt = require('jsonwebtoken');
const { Token } = require('../db/models/models');

// сервис для создания токенов
class TokenService {

  // метод для генерации токенов
  async generateTokens(payload) {
    // генерируем аксес токен (1. информация токена / 2. секретный ключ / 3. опции {устанавливаем срок действия токена})
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '60d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  // метод для сохранения токенов
  async saveToken(userId, refreshToken) {

    // ищем токен по пользователю
    const tokenData = await Token.findOne({where: {userId}});

    // если находим то перезаписываем токен и сохраняем
    if (tokenData) {
      tokenData.refresh_token = refreshToken;
      return tokenData.save()
    }

    // если не находим то создаем и ВОЗВРАЩАЕМ токен
    const token = await Token.create({userId, refresh_token: refreshToken})

    return token
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.destroy({where: {refresh_token : refreshToken }})
    return tokenData
  }

  // валидация access token
  async validateAccessToken(token){
    try {
      // верификация реализуется методом verify (первый арг - сам токен, второй секретный ключ из окружения )
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData
    } catch (e) {
      // возвращаем null если токен не верифицирован
      return null
    }
  }

  // валидация access token
  async validateRefreshToken(token){
    try {
      // верификация реализуется методом verify (первый арг - сам токен, второй секретный ключ из окружения )
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData
    } catch (e) {
      // возвращаем null если токен не верифицирован
      return null
    }
  }

  async findToken(refreshToken){
    const tokenData = await Token.findOne({where:{refresh_token : refreshToken}})
    return tokenData
  }

}

module.exports = new TokenService();
