/* eslint-disable */
// подключаем сервис для работы с users
const { validationResult } = require('express-validator');
const userService = require('../services/userService');
const ApiError = require('../exceptions/ApiError');
// подключаем результат работы валидатора

class UserController {
  // eslint-disable-next-line consistent-return
  async registration(req, res, next) {
    try {
      // errors will contain array with errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Недопустимый логин или пароль', errors.array()));
      }
      const { name, email, password } = req.body;
      const userData = await userService.registration(name, email, password);

      // refreshToken будем хранить в куке (настраиваем опции куки)
      res.cookie('refreshToken', userData.refreshToken, { maxAge: '60e3', httpOnly: true });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);

      // перезаписываем токен, генерируем, кладем в куку, отправляем на клиент
      res.cookie('refreshToken', userData.refreshToken, { maxAge: '60e3', httpOnly: true });
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      // вытаскиваем токен из куки
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);

      // удаляем куку
      res.clearCookie('refreshToken');

      res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);

      // при успешной активации перенаправляем клиента (! делаем редирект куда нужно)
      return res.send('Аккаунт успешно активирован');
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      // вытаскиваем токен из куки
      const { refreshToken } = res.cookies;
      await userService.refresh(refreshToken);

      // вытаскиваем данные
      const userData = await userService.refresh(refreshToken);

      // перезаписываем токен, генерируем, кладем в куку, отправляем на клиент
      res.cookie('refreshToken', userData.refreshToken, { maxAge: '60e3', httpOnly: true });
      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
