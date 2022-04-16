/* eslint-disable camelcase,class-methods-use-this */
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { User } = require('../db/models/models');
const ApiError = require('../exceptions/ApiError');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto');

class UserService {
  // --------------------------- Регистрация --------------------------------
  async registration(name, email, password) {
    const checkUser = await User.findOne({ where: { email } });

    if (checkUser) {
      throw ApiError.badRequest(`Пользователь с адресом ${email} уже существует`);
    }

    const hashPassword = await bcrypt.hash(password, 5);

    // создаем ссылку для активации пользователя
    const activationLink = uuid.v4();
    const user = await User.create({
      name, email, password: hashPassword, activationLink,
    });

    // отправляем ссылку для активации по емэйлу
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);

    // получаем токены с токен сервиса
    // в payload нельзя помещать пароль и конфиденциальную информацию, ! создаём dtos (/dtos)
    // в userDto будут поля заданные в классе (id, name, email, isActivated)
    const userDto = new UserDto(user);

    // payload ожидает объект, для этого спрэдом разворачиваем userDto
    const tokens = await tokenService.generateTokens({ ...userDto });

    // сохраняем рефреш токен в БД
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    // возвращаем объектом два токена и информацию по пользователю
    return { ...tokens, user: userDto };
  }
  // --------------------------- Регистрация --------------------------------

  // ---------------------------  Логин -------------------------------------
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.badRequest('Пользователь не найден');
    }
    const isPasswordEquals = await bcrypt.compare(password, user.password);
    if (!isPasswordEquals) {
      throw ApiError.badRequest('Неверный логин или пароль');
    }
    const userDto = new UserDto(user);

    // payload ожидает объект, для этого спрэдом разворачиваем userDto
    const tokens = await tokenService.generateTokens({ ...userDto });

    // сохраняем токены в БД
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    // возвращаем объектом два токена и информацию по пользователю
    return { ...tokens, user: userDto };
  }
  // ---------------------------  Логин -------------------------------------

  // ---------------------------  Логаут -------------------------------------

  async logout(refreshToken) {
    // удаляем токен
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  // ---------------------------  Логаут -------------------------------------

  // ------------------------- Обновление Токена ------------------------------
  async refresh(refreshToken) {
    // проверяем наличие токена, если нет то пользователь не авторизован (кидаем ошибку)
    if (!refreshToken) {
      throw ApiError.unAuthorized();
    }
    // если токен есть, то валидируем токен и достаем токен из дб (складываем данные в переменные)
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    // если токен не валиден и токена нет в бд
    if (!userData || !tokenFromDb) {
      throw ApiError.unAuthorized();
    }

    // информация о пользователе могла измениться, нужно заново найти пользователя
    const user = await User.findOne({ where: { id: userData.id } });

    const userDto = new UserDto(user);

    // payload ожидает объект, для этого спрэдом разворачиваем userDto
    const tokens = await tokenService.generateTokens({ ...userDto });

    // сохраняем токены в БД
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    // возвращаем объектом два токена и информацию по пользователю
    return { ...tokens, user: userDto };
  }
  // ------------------------- Обновление Токена -----------------------------

  // --------------------- Активация пользователя ---------------------------
  async activate(activationLink) {
    // находим юзера с нужной ссылкой
    const user = await User.findOne({ where: { activationLink } });
    if (!user) {
      throw ApiError.badRequest('Неверная ссылка активации');
    }
    user.isActivated = true;
    await user.save();
  }
  // --------------------- Активация пользователя ---------------------------

  // ----- Получение всех пользователей для авторизованного пользователя --------
  async getAllUsers() {
    const users = await User.findAll();
    return users;
  }
}

module.exports = new UserService();
